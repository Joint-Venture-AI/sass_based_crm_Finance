// src/models/user_subscription.interface.ts
import { Types } from "mongoose";

export enum SubscriptionInterval {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum IUserSubscriptionStatus {
  ACTIVE = "ACTIVE", // subscription is active and paid
  PAST_DUE = "PAST_DUE", // payment failed / overdue
  CANCELLED = "CANCELLED", // user cancelled subscription
  UNPAID = "UNPAID", // not yet paid (e.g., pending payment)
  REFUNDED = "REFUNDED", // refunded by admin/Stripe
}

export interface IUserSubscription {
  _id?: Types.ObjectId;

  userId: Types.ObjectId; // Link to user
  subscriptionId: Types.ObjectId; // Link to subscription package

  stripeCustomerId?: string; // Stripe customer ID
  stripeSubscriptionId?: string; // Stripe subscription ID
  latestPaymentIntentId?: string; // Stripe payment intent ID for the latest invoice

  type: SubscriptionInterval; // MONTHLY or YEARLY
  status: IUserSubscriptionStatus; // ACTIVE, UNPAID, CANCELLED, etc.

  startedAt?: Date; // when subscription started
  currentPeriodEnd?: Date; // current billing period end
  createdAt?: Date;
  updatedAt?: Date;
}
