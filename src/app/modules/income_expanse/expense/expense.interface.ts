import mongoose from "mongoose";

export interface IExpense extends Document {
  user: mongoose.Types.ObjectId;
  tId: string; // Unique transaction ID
  date: Date; // Transaction date
  amount: number; // Positive amount
  currency: string; // Default "EUR"
  counterparty?: string | null; // Merchant / payer
  description?: string | null; // Optional notes
  bookedOrPending: "booked" | "pending";
  category: string; // Category, e.g., "Transport > Taxi"
}
