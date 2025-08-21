import { model, Schema } from "mongoose";
import { IExpense } from "./expense.interface";

const ExpenseSchema = new Schema<IExpense>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tId: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "EUR" },
    counterparty: { type: String },
    description: { type: String },
    categoryType: { type: String },
    bookedOrPending: {
      type: String,
      enum: ["booked", "pending"],
      default: "booked",
    },
  },
  { timestamps: true }
);

export const Expense = model<IExpense>("Expense", ExpenseSchema);
