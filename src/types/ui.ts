import type { MonthlyBudget } from "./budget.ts";
import type { Expense } from "./expense.ts";
import type { SavingsEntry } from "./savings.ts";

export type AppTab = "expenses" | "savings";

export type AppState = {
  tab: AppTab;
  expenses: Expense[];
  savings: SavingsEntry[];
  budget: MonthlyBudget;
};

export type ViewStatus = "loading" | "ready" | "error";

export type FieldErrors = Record<string, string>;
