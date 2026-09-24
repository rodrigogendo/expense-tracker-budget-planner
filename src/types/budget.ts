import type { ExpenseCategory } from "./expense.ts";

export type MonthlyBudget = {
  expenseLimit: number;
  totalBudget: number;
  byCategory: Record<ExpenseCategory, number>;
};
