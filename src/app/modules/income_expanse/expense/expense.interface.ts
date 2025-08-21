import { Types } from "mongoose";

export interface IExpense extends Document {
  user: Types.ObjectId;
  tId: string;
  date: Date;
  amount: number;
  currency: string;
  counterparty?: string;
  description?: string;
  categoryType?: string;
  bookedOrPending?: "booked" | "pending";
}
