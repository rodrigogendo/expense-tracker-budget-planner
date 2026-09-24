import { emptyCategoryTotals } from "../functions/money.ts";
import type { MonthlyBudget } from "../types/budget.ts";
import type { Expense, ExpenseCategory } from "../types/expense.ts";
import type { SavingsEntry } from "../types/savings.ts";
import type { AppState, AppTab } from "../types/ui.ts";

type Listener = () => void;

const listeners: Listener[] = [];

let state: AppState = {
  tab: "expenses",
  expenses: [],
  savings: [],
  budget: {
    expenseLimit: 0,
    totalBudget: 0,
    byCategory: emptyCategoryTotals(),
  },
};

export function getState(): AppState {
  return state;
}

export function subscribe(listener: Listener): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index >= 0) listeners.splice(index, 1);
  };
}

function notify(): void {
  for (const listener of listeners) listener();
}

function setState(next: AppState): void {
  state = next;
  notify();
}

export function setTab(tab: AppTab): void {
  setState({ ...state, tab });
}

export function addExpense(expense: Expense): void {
  setState({ ...state, expenses: [...state.expenses, expense] });
}

export function updateExpense(id: string, expense: Omit<Expense, "id">): void {
  setState({
    ...state,
    expenses: state.expenses.map((item) => (item.id === id ? { id, ...expense } : item)),
  });
}

export function deleteExpense(id: string): void {
  setState({
    ...state,
    expenses: state.expenses.filter((item) => item.id !== id),
  });
}

export function setBudgetFields(fields: Pick<MonthlyBudget, "expenseLimit" | "totalBudget">): void {
  setState({
    ...state,
    budget: { ...state.budget, ...fields },
  });
}

export function setCategoryBudget(category: ExpenseCategory, amount: number): void {
  setState({
    ...state,
    budget: {
      ...state.budget,
      byCategory: { ...state.budget.byCategory, [category]: amount },
    },
  });
}

export function addSavings(entry: SavingsEntry): void {
  setState({ ...state, savings: [...state.savings, entry] });
}

export function updateSavings(id: string, entry: Omit<SavingsEntry, "id">): void {
  setState({
    ...state,
    savings: state.savings.map((item) => (item.id === id ? { id, ...entry } : item)),
  });
}

export function deleteSavings(id: string): void {
  setState({
    ...state,
    savings: state.savings.filter((item) => item.id !== id),
  });
}

export function createId(): string {
  return crypto.randomUUID();
}
