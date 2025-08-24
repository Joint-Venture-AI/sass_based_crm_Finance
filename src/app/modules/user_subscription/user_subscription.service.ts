/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SubscriptionInterval } from "./user_subscription.interface";

const createPaymentIntent = async (
  data: { type: SubscriptionInterval; subscriptionId: string },
  userId: string
) => {};
export const UserSubscriptionService = { createPaymentIntent };
