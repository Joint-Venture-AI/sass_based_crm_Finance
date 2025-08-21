/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import mongoose from "mongoose";
import { Expense } from "../expense/expense.model";
import { Income } from "../income/income.mode";

const getMonthlyCashFlowService = async (userId: string) => {
  // Group income by month/year
  const income = await Income.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: { month: { $month: "$date" }, year: { $year: "$date" } },
        totalIncome: { $sum: "$amount" },
      },
    },
  ]);

  // Group expense by month/year
  const expense = await Expense.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: { month: { $month: "$date" }, year: { $year: "$date" } },
        totalExpense: { $sum: "$amount" },
      },
    },
  ]);

  // Merge results
  const cashflowMap: Record<
    string,
    { income: number; expense: number; net: number }
  > = {};

  income.forEach((i) => {
    const key = `${i._id.year}-${i._id.month}`;
    if (!cashflowMap[key]) cashflowMap[key] = { income: 0, expense: 0, net: 0 };
    cashflowMap[key].income = i.totalIncome;
  });

  expense.forEach((e) => {
    const key = `${e._id.year}-${e._id.month}`;
    if (!cashflowMap[key]) cashflowMap[key] = { income: 0, expense: 0, net: 0 };
    cashflowMap[key].expense = e.totalExpense;
  });

  // Compute net
  Object.keys(cashflowMap).forEach((key) => {
    cashflowMap[key].net = cashflowMap[key].income - cashflowMap[key].expense;
  });

  // Format response
  return Object.entries(cashflowMap).map(([key, values]) => ({
    month: key,
    income: values.income,
    expense: values.expense,
    net: values.net,
  }));
};

export const FinanceService = {
  getMonthlyCashFlowService,
};
