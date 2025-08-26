// src/models/user_subscription.model.ts
import { Schema, model } from "mongoose";
import {
  IUserSubscription,
  IUserSubscriptionStatus,
  SubscriptionInterval,
} from "./user_subscription.interface";

const UserSubscriptionSchema = new Schema<IUserSubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
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
    status: {
      type: String,
      enum: Object.values(IUserSubscriptionStatus),
      default: IUserSubscriptionStatus.UNPAID,
    },
    stripeCustomerId: { type: String, trim: true },
    stripeSubscriptionId: { type: String, trim: true },
    latestPaymentIntentId: { type: String, trim: true },
    startedAt: { type: Date },
    currentPeriodEnd: { type: Date },
  },
  { timestamps: true }
);

// Indexes for faster lookup by Stripe IDs
UserSubscriptionSchema.index({ stripeSubscriptionId: 1 });
UserSubscriptionSchema.index({ stripeCustomerId: 1 });

export const UserSubscription = model<IUserSubscription>(
  "UserSubscription",
  UserSubscriptionSchema
);
