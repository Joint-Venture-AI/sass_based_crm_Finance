/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Stripe from "stripe";
import { appConfig } from "../../config";
import AppError from "../../errors/AppError";
import { AuthController } from "../auth/auth.controller";
import { AuthService } from "../auth/auth.service";
import { stripe } from "../stripe/stripe";
import SubscriptionPackage from "../subscription/subscription.model";
import User from "../users/user/user.model";
import {
  IUserSubscriptionStatus,
  SubscriptionInterval,
} from "./user_subscription.interface";
import { UserSubscription } from "./user_subscription.model";
import logger from "../../utils/serverTools/logger";

const createUserWithSubscription = async (payload: {
  package: { type: SubscriptionInterval; subscriptionId: string };
  userData: { email: string; password: string; fullName: string };
}) => {
  const subscriptionData = await SubscriptionPackage.findById(
    payload.package.subscriptionId
  );

  if (!subscriptionData) {
    throw new AppError(404, "Subscription not found.");
  }
  const userData = await AuthService.createUser(payload.userData);

  await UserSubscription.create({
    subscriptionId: payload.package.subscriptionId,
    type: payload.package.type,
    userId: userData._id,
  });

  return userData;
};

export const createSubscriptionSession = async (userId: string) => {
  // 1️⃣ Fetch user
  const userData = await User.findById(userId);
  if (!userData) {
    throw new AppError(404, "User not found.");
  }

  // 2️⃣ Fetch user's subscription
  const userSubscription = await UserSubscription.findOne({ userId });
  if (!userSubscription) {
    throw new AppError(404, "User subscription not found.");
  }

  // 3️⃣ Fetch subscription package
  const subscriptionData = await SubscriptionPackage.findById(
    userSubscription.subscriptionId
  );
  if (!subscriptionData) {
    throw new AppError(404, "Subscription package not found.");
  }

  // 4️⃣ Determine Stripe priceId
  let priceId: string;
  if (userSubscription.type === SubscriptionInterval.MONTHLY) {
    if (!subscriptionData.stripeMonthlyPriceId) {
      throw new AppError(
        500,
        "Stripe monthly price ID not set for this package."
      );
    }
    priceId = subscriptionData.stripeMonthlyPriceId;
  } else if (userSubscription.type === SubscriptionInterval.YEARLY) {
    if (!subscriptionData.stripeYearlyPriceId) {
      throw new AppError(
        500,
        "Stripe yearly price ID not set for this package."
      );
    }
    priceId = subscriptionData.stripeYearlyPriceId;
  } else {
    throw new AppError(
      400,
      `Invalid subscription type: ${userSubscription.type}`
    );
  }

  // 5️⃣ Create or reuse Stripe customer
  let customerId = userSubscription.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: userData.email,
      metadata: { userId: userId.toString() },
    });
    customerId = customer.id;
  }

  // 6️⃣ Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer: customerId,
    success_url: "https://01t71ck4-4002.inc1.devtunnels.ms/",
    cancel_url: "https://01t71ck4-4002.inc1.devtunnels.ms/",
  });

  // 7️⃣ Save stripeCustomerId if it was newly created
  if (!userSubscription.stripeCustomerId) {
    userSubscription.stripeCustomerId = customerId;
    await userSubscription.save();
  }

  // 8️⃣ Return session URL for frontend redirect
  return { url: session.url };
};

export const stripeWebhook = async (rawBody: Buffer, sig: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      appConfig.payment.stripe.webhook!
    );
  } catch (err: any) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  const data = event.data.object;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = data as Stripe.Checkout.Session;
        if (!session.subscription) {
          logger.info(
            "Checkout session completed without subscription ID:",
            session.id
          );
          break;
        }

        await UserSubscription.findOneAndUpdate(
          { stripeCustomerId: session.customer as string },
          {
            stripeSubscriptionId: session.subscription as string,
            status: IUserSubscriptionStatus.ACTIVE,
            startedAt: new Date(),
          }
        );

        logger.info(
          `Subscription ${session.subscription} created for customer ${session.customer}`
        );
        break;
      }

      case "invoice.paid": {
        const invoice = data as Stripe.Invoice;
        const subscriptionId =
          typeof (invoice as any).subscription === "string"
            ? (invoice as any).subscription
            : null;
        if (!subscriptionId) {
          logger.info("Invoice paid has no subscription ID:", invoice.id);
          break;
        }

        await UserSubscription.findOneAndUpdate(
          { stripeSubscriptionId: subscriptionId },
          {
            status: IUserSubscriptionStatus.ACTIVE,
            currentPeriodEnd: invoice.period_end
              ? new Date(invoice.period_end * 1000)
              : undefined,
          }
        );

        logger.info(
          `Subscription ${subscriptionId} renewed, current period ends: ${invoice.period_end}`
        );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = data as Stripe.Invoice;
        const subscriptionId =
          typeof (invoice as any).subscription === "string"
            ? (invoice as any).subscription
            : null;
        if (!subscriptionId) {
          logger.info(
            "Invoice payment failed has no subscription ID:",
            invoice.id
          );
          break;
        }

        await UserSubscription.findOneAndUpdate(
          { stripeSubscriptionId: subscriptionId },
          { status: IUserSubscriptionStatus.PAST_DUE }
        );

        logger.warn(`Subscription ${subscriptionId} payment failed`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = data as Stripe.Subscription;
        await UserSubscription.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          { status: IUserSubscriptionStatus.CANCELLED }
        );

        logger.info(`Subscription ${subscription.id} canceled`);
        break;
      }

      default:
        logger.warn(`Unhandled Stripe event type: ${event.type}`);
        break;
    }
  } catch (err) {
    logger.error(`Error processing Stripe event ${event.type}:`, err);
  }

  return { received: true };
};

export const checkUserSubscriptionStatus = async (userId: string) => {
  const userStatus = await UserSubscription.findOne({ userId: userId });
  if (!userStatus) {
    throw new AppError(404, "User subscription data not found.");
  }
  if (userStatus?.status === IUserSubscriptionStatus.ACTIVE) {
    return true;
  } else {
    return false;
  }
};

export const UserSubscriptionService = {
  createUserWithSubscription,
  stripeWebhook,
};
