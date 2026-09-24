import { EXPENSE_CATEGORIES } from "../types/expense.ts";
import {
  currentMonthExpenses,
  formatMoney,
  remainingByCategory,
  remainingClass,
  spentByCategory,
  totalSpent,
} from "../functions/money.ts";
import { parseNonNegativeNumber } from "../functions/validate.ts";
import { getState, setCategoryBudget } from "../state/store.ts";
import { emptyState, fieldError, loadingState } from "./states.ts";

export function bindSidebar(root: HTMLElement): void {
  root.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    const category = EXPENSE_CATEGORIES.find((item) => item === input.dataset.category);
    if (!category) return;

    const amount = parseNonNegativeNumber(input.value);
    const errorBox = root.querySelector("[data-category-error]");
    if (amount === null) {
      if (errorBox) errorBox.innerHTML = fieldError("Category budgets must be 0 or greater.");
      return;
    }
    if (errorBox) errorBox.innerHTML = "";
    setCategoryBudget(category, amount);
  });
}

export function renderExpenseSidebar(root: HTMLElement, status: "loading" | "ready"): void {
  if (status === "loading") {
    root.innerHTML = loadingState("Loading totals…");
    return;
  }

  const { expenses, budget } = getState();
  const monthExpenses = currentMonthExpenses(expenses);
  const spent = totalSpent(monthExpenses);
  const byCategory = spentByCategory(monthExpenses);
  const noExpenses = monthExpenses.length === 0;

  const rows = EXPENSE_CATEGORIES.map((category) => {
    const categorySpent = byCategory[category];
    const categoryBudget = budget.byCategory[category];
    const remaining = remainingByCategory(categoryBudget, categorySpent);
    return `
      <li>
        <div class="category-row">
          <span>${category}</span>
          <span class="remaining ${remainingClass(remaining)}">${formatMoney(remaining)}</span>
        </div>
        <div class="category-meta">
          <span>Spent ${formatMoney(categorySpent)}</span>
          <label>Budget
            <input data-category="${category}" type="number" min="0" step="0.01" value="${categoryBudget}">
          </label>
        </div>
      </li>
    `;
  }).join("");

  root.innerHTML = `
    <div class="sidebar-block">
      <h2>This month</h2>
      ${noExpenses ? emptyState("No expenses this month.", "Use the form on the right to add one.") : ""}
      <p class="total">Total ${formatMoney(spent)}</p>
      <div data-category-error></div>
      <ul class="category-list">${rows}</ul>
    </div>
  `;
}
