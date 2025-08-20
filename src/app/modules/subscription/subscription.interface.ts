export interface ISubscriptionPackage extends Document {
  name: string;
  type: "FLAT_RATE" | "BUSINESS" | "PREMIUM_BUSINESS";
  priceMonthly: number;
  priceYearly: number;
  vatIncluded: boolean;
  vatPercentage: number;
  features: string[];
  isActive: boolean;
  stripeMonthlyPriceId?: string;
  stripeYearlyPriceId?: string;
  createdAt: Date;
  updatedAt: Date;
}
