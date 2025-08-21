import { model, Schema } from "mongoose";
import { IIncome } from "./income.interface";

const IncomeSchema = new Schema<IIncome>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tId: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "EUR" },
    counterparty: { type: String },
    description: { type: String },
    bookedOrPending: {
      type: String,
      enum: ["booked", "pending"],
      default: "booked",
    },
  },
  { timestamps: true }
);

export const Income = model<IIncome>("Income", IncomeSchema);
