import { Types } from "mongoose";

export interface IUserSubscription {
  userId: Types.ObjectId;
  subscriptionId: Types.ObjectId;
  type: SubscriptionInterval;
  tId: string;
  payment_status: IUserSubscriptionStatus;
}
export enum SubscriptionInterval {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}
export enum IUserSubscriptionStatus {
  CANCELLED = "CANCELLED",
  PAID = "PAID",
  UNPAID = "UNPAID",
  REFUNDED = "REFUNDED",
}
