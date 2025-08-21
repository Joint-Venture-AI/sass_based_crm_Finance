/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import logger from "../../utils/serverTools/logger";
import { Expense } from "../income_expanse/expense/expense.model";
import { Income } from "../income_expanse/income/income.mode";

/* eslint-disable @typescript-eslint/no-explicit-any */
type RawTransaction = {
  tId: string;
  date: string;
  amount: number;
  currency: string;
  counterparty?: string;
  description?: string;
  type: "income" | "expense";
  bookedOrPending?: "booked" | "pending";
};

export async function saveTransactionsSkipDuplicates(
  userId: string,
  rawTransactions: RawTransaction[]
) {
  const incomeTransactions: RawTransaction[] = [];
  const expenseTransactions: RawTransaction[] = [];

  // Separate income and expense
  rawTransactions.forEach((tx) => {
    if (tx.type === "income") incomeTransactions.push(tx);
    else if (tx.type === "expense") expenseTransactions.push(tx);
  });

  // Helper to filter out existing transactions
  async function filterNewTransactions(
    model: any,
    transactions: RawTransaction[]
  ) {
    const existingIds = await model.find(
      { tId: { $in: transactions.map((tx) => tx.tId) } },
      { tId: 1 }
    );
    const existingSet = new Set(existingIds.map((t: any) => t.tId));
    return transactions.filter((tx) => !existingSet.has(tx.tId));
  }

  // Filter duplicates
  const newIncomes = await filterNewTransactions(Income, incomeTransactions);
  const newExpenses = await filterNewTransactions(Expense, expenseTransactions);

  // Map to Mongoose format
  const incomeDocs = newIncomes.map((tx) => ({
    user: userId,
    tId: tx.tId,
    date: new Date(tx.date),
    amount: Math.abs(tx.amount),
    currency: tx.currency || "EUR",
    counterparty: tx.counterparty || null,
    description: tx.description || null,
    bookedOrPending: tx.bookedOrPending || "booked",
  }));

  const expenseDocs = newExpenses.map((tx) => ({
    user: userId,
    tId: tx.tId,
    date: new Date(tx.date),
    amount: Math.abs(tx.amount),
    currency: tx.currency || "EUR",
    counterparty: tx.counterparty || null,
    description: tx.description || null,
    bookedOrPending: tx.bookedOrPending || "booked",
  }));

  // Save to DB
  const savedIncomes = await Income.insertMany(incomeDocs);
  const savedExpenses = await Expense.insertMany(expenseDocs);

  logger.info(
    `Saved ${savedIncomes.length} new incomes and ${savedExpenses.length} new expenses.`
  );
  return { incomes: savedIncomes, expenses: savedExpenses };
}
