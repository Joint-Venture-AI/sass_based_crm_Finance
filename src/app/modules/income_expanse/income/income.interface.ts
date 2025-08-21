import { Types } from "mongoose";

export interface IIncome extends Document {
  user: Types.ObjectId;
  tId: string;
  date: Date;
  amount: number;
  currency: string;
  counterparty?: string;
  description?: string;
  bookedOrPending?: "booked" | "pending";
}
