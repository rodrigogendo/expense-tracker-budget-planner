import type { ExpenseCategory } from "./expense.ts";

export type MonthlyBudget = {
  totalBudget: number;
  byCategory: Record<ExpenseCategory, number>;
};
