import { EXPENSE_CATEGORIES, type Expense, type ExpenseCategory } from "../types/expense.ts";
import type { SavingsEntry } from "../types/savings.ts";
import { isCurrentMonth } from "./date.ts";

export type DailyTotal = {
  date: string;
  total: number;
};

export function formatMoney(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function remainingClass(amount: number): "positive" | "negative" {
  return amount >= 0 ? "positive" : "negative";
}

export function currentMonthExpenses(expenses: Expense[], today = new Date()): Expense[] {
  return expenses.filter((expense) => isCurrentMonth(expense.date, today));
}

export function totalSpent(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.value, 0);
}

export function emptyCategoryTotals(): Record<ExpenseCategory, number> {
  return Object.fromEntries(EXPENSE_CATEGORIES.map((category) => [category, 0])) as Record<
    ExpenseCategory,
    number
  >;
}

export function spentByCategory(expenses: Expense[]): Record<ExpenseCategory, number> {
  const totals = emptyCategoryTotals();
  for (const expense of expenses) {
    totals[expense.category] += expense.value;
  }
  return totals;
}

export function remainingOverall(totalBudget: number, spent: number): number {
  return totalBudget - spent;
}

export function remainingByCategory(budget: number, spent: number): number {
  return budget - spent;
}

export function dailyTotals(expenses: Expense[]): DailyTotal[] {
  const byDate = new Map<string, number>();
  for (const expense of expenses) {
    byDate.set(expense.date, (byDate.get(expense.date) ?? 0) + expense.value);
  }
  return [...byDate.entries()]
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function savingsTotal(entries: SavingsEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.amount, 0);
}
