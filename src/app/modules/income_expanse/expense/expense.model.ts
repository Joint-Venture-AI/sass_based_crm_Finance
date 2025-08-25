import mongoose, { Schema } from "mongoose";
import { IExpense } from "./expense.interface";

const ExpenseSchema = new Schema<IExpense>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tId: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "EUR" },
    counterparty: { type: String, default: null },
    description: { type: String, default: null },
    bookedOrPending: {
      type: String,
      enum: ["booked", "pending"],
      default: "booked",
    },
    category: { type: String, default: "Uncategorized" }, // <-- hybrid system will update this
  },
  { timestamps: true }
);

export const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);
