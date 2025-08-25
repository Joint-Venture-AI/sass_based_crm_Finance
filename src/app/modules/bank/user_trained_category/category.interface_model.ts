import { Schema, model, Types } from "mongoose";

export interface IMerchantCategory {
  userId: Types.ObjectId;
  merchantName: string;
  normalizedName: string; // cleaned merchant name
  category: string; // e.g., "Transport > Taxi"
}

const MerchantCategorySchema = new Schema<IMerchantCategory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    merchantName: { type: String, required: true },
    normalizedName: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export const MerchantCategory = model<IMerchantCategory>(
  "MerchantCategory",
  MerchantCategorySchema
);
