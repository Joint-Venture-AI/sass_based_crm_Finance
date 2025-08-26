import { Schema, model } from "mongoose";

export interface IMerchantCategory {
  merchantName: string;
  normalizedName: string; // cleaned merchant name
  category: string; // e.g., "Transport > Taxi"
}

const MerchantCategorySchema = new Schema<IMerchantCategory>(
  {
    merchantName: { type: String, required: true },
    normalizedName: { type: String, required: true, unique: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export const MerchantCategory = model<IMerchantCategory>(
  "MerchantCategory",
  MerchantCategorySchema
);
