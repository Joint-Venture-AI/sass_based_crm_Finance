import { Schema, model } from "mongoose";
import {
  IUserSubscription,
  IUserSubscriptionStatus,
  SubscriptionInterval,
} from "./user_subscription.interface";

const UserSubscriptionSchema = new Schema<IUserSubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPackage",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(SubscriptionInterval),
      required: true,
    },
    tId: { type: String, required: true, trim: true },
    payment_status: {
      type: String,
      enum: Object.values(IUserSubscriptionStatus),
      default: IUserSubscriptionStatus.UNPAID,
    },
  },
  { timestamps: true }
);

export const UserSubscription = model<IUserSubscription>(
  "UserSubscription",
  UserSubscriptionSchema
);
