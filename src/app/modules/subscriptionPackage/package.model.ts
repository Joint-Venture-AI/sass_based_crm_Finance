import { Schema, model, Document } from "mongoose";

// Allowed intervals
export const SUBSCRIPTION_INTERVALS = ["day", "week", "month", "year"] as const;
export type SubscriptionInterval = (typeof SUBSCRIPTION_INTERVALS)[number];

// Interface
export interface ISubscriptionPackages extends Document {
  name: string; // Plan name
  price: number; // Price in your currency
  interval: SubscriptionInterval; // Billing interval
  stripeProductId?: string; // Stripe Product ID (prod_ABC123)
  stripePriceId?: string; // Stripe Price ID (price_ABC123)
}

// Schema
const subscriptionPackageSchema = new Schema<ISubscriptionPackages>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    interval: {
      type: String,
      required: true,
      enum: SUBSCRIPTION_INTERVALS,
      default: "month",
    },
    stripeProductId: {
      type: String,
      default: null,
    },
    stripePriceId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Model
const SubscriptionPackage = model<ISubscriptionPackages>(
  "SubscriptionPackage",
  subscriptionPackageSchema
);

export default SubscriptionPackage;
