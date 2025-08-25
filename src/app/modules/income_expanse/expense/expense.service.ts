import mongoose from "mongoose";
import { MerchantCategory } from "../../bank/user_trained_category/category.interface_model";
import { Expense } from "./expense.model";

const updateExpenseCategory = async (
  userId: string,
  expenseId: string,
  newCategory: string
) => {
  // 1. Find the expense
  const expense = await Expense.findOne({ _id: expenseId, user: userId });
  if (!expense) throw new Error("Expense not found");

  // 2. Update expense category
  expense.category = newCategory;
  await expense.save();

  // 3. Update / create user-trained merchant mapping
  if (expense.counterparty) {
    const normalizedName = expense.counterparty
      .toLowerCase()
      .replace(/[^a-z0-9 ]/gi, "")
      .trim();

    await MerchantCategory.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId), normalizedName },
      {
        userId: userId,
        merchantName: expense.counterparty,
        normalizedName,
        category: newCategory,
      },
      { upsert: true, new: true }
    );
  }
  return expense;
};

export const ExpenseService = {
  updateExpenseCategory,
};
