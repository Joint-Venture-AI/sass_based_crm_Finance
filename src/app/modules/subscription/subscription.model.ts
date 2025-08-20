import mongoose, { Schema } from "mongoose";
import { ISubscriptionPackage } from "./subscription.interface";

const SubscriptionPackageSchema = new Schema<ISubscriptionPackage>(
  {
    name: {
      type: String,
      required: [true, "Package name is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Package name must be at most 100 characters"],
    },
    type: {
      type: String,
      required: true,
      enum: ["FLAT_RATE", "BUSINESS", "PREMIUM_BUSINESS"],
      unique: true, // ensures only one package per type
    },
    priceMonthly: {
      type: Number,
      required: [true, "Monthly price is required"],
      min: [0, "Price must be at least 0"],
    },
    priceYearly: {
      type: Number,
      required: [true, "Yearly price is required"],
      min: [0, "Price must be at least 0"],
    },
    vatIncluded: {
      type: Boolean,
      required: true,
      default: false,
    },
    vatPercentage: {
      type: Number,
      required: true,
      default: 22,
      min: [0, "VAT cannot be negative"],
      max: [100, "VAT cannot exceed 100%"],
    },
    features: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "At least one feature must be specified",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true, // quick filtering of active packages
    },
    stripeMonthlyPriceId: {
      type: String,
      sparse: true,
      trim: true,
    },
    stripeYearlyPriceId: {
      type: String,
      sparse: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // include virtuals in JSON
    toObject: { virtuals: true },
  }
);

// Virtuals: Final price with VAT included
SubscriptionPackageSchema.virtual("finalPriceMonthly").get(function (
  this: ISubscriptionPackage
) {
  return this.vatIncluded
    ? this.priceMonthly
    : this.priceMonthly * (1 + this.vatPercentage / 100);
});

SubscriptionPackageSchema.virtual("finalPriceYearly").get(function (
  this: ISubscriptionPackage
) {
  return this.vatIncluded
    ? this.priceYearly
    : this.priceYearly * (1 + this.vatPercentage / 100);
});

// Indexes
SubscriptionPackageSchema.index({ name: "text", type: "text" }); // search by name/type
SubscriptionPackageSchema.index({ type: 1, isActive: 1 }); // efficient queries by type + active

// Pre-save hook: enforce uppercase enum values consistency
SubscriptionPackageSchema.pre("save", function (next) {
  if (this.isModified("type")) {
    this.type = this.type.toUpperCase() as ISubscriptionPackage["type"];
  }
  next();
});

const SubscriptionPackage = mongoose.model<ISubscriptionPackage>(
  "SubscriptionPackage",
  SubscriptionPackageSchema
);

export default SubscriptionPackage;
