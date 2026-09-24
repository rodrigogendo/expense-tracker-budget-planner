import { EXPENSE_CATEGORIES, type ExpenseCategory } from "../types/expense.ts";
import type { FieldErrors } from "../types/ui.ts";
import { isValidISODate } from "./date.ts";

export type ExpenseInput = {
  title: string;
  value: string;
  category: string;
  date: string;
};

export type ValidExpense = {
  title: string;
  value: number;
  category: ExpenseCategory;
  date: string;
};

export type SavingsInput = {
  amount: string;
  date: string;
};

export type ValidSavings = {
  amount: number;
  date: string;
};

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: FieldErrors };

export function validateExpense(input: ExpenseInput): ValidationResult<ValidExpense> {
  const errors: FieldErrors = {};
  const title = input.title.trim();
  const value = Number(input.value);
  const category = input.category;
  const date = input.date.trim();

  if (!title) errors.title = "Enter a title.";
  if (!Number.isFinite(value) || value <= 0) errors.value = "Enter an amount greater than 0.";
  if (!isValidISODate(date)) errors.date = "Choose a valid date.";
  if (!isExpenseCategory(category)) errors.category = "Choose a category.";

  if (Object.keys(errors).length > 0 || !isExpenseCategory(category)) {
    return { ok: false, errors };
  }
  return { ok: true, value: { title, value, category, date } };
}

export function validateSavings(input: SavingsInput): ValidationResult<ValidSavings> {
  const errors: FieldErrors = {};
  const amount = Number(input.amount);
  const date = input.date.trim();

  if (!Number.isFinite(amount) || amount <= 0) errors.amount = "Enter an amount greater than 0.";
  if (!isValidISODate(date)) errors.date = "Choose a valid date.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, value: { amount, date } };
}

export function parseNonNegativeNumber(raw: string): number | null {
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

function isExpenseCategory(value: string): value is ExpenseCategory {
  return (EXPENSE_CATEGORIES as readonly string[]).includes(value);
}
