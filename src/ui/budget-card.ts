import { currentMonthExpenses, formatMoney, remainingClass, remainingOverall, totalSpent } from "../functions/money.ts";
import { parseNonNegativeNumber } from "../functions/validate.ts";
import { getState, setBudgetFields } from "../state/store.ts";
import { fieldError, loadingState } from "./states.ts";

export function bindBudgetCard(root: HTMLElement): void {
  root.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!(event.target instanceof HTMLFormElement)) return;

    const form = event.target;
    const data = new FormData(form);
    const limit = parseNonNegativeNumber(String(data.get("expenseLimit") ?? ""));
    const total = parseNonNegativeNumber(String(data.get("totalBudget") ?? ""));
    const errorBox = form.querySelector("[data-budget-error]");

    if (limit === null || total === null) {
      if (errorBox) errorBox.innerHTML = fieldError("Enter 0 or a positive amount for both fields.");
      return;
    }

    if (errorBox) errorBox.innerHTML = "";
    setBudgetFields({ expenseLimit: limit, totalBudget: total });
  });
}

export function renderBudgetCard(root: HTMLElement, status: "loading" | "ready"): void {
  if (status === "loading") {
    root.innerHTML = `<article class="card">${loadingState("Loading budget…")}</article>`;
    return;
  }

  const { budget, expenses } = getState();
  const spent = totalSpent(currentMonthExpenses(expenses));
  const remaining = remainingOverall(budget.totalBudget, spent);
  const noBudget = budget.totalBudget === 0 && budget.expenseLimit === 0;

  root.innerHTML = `
    <article class="card">
      <h2>Monthly budget</h2>
      ${noBudget ? `<p class="hint">No budget set yet. Add a limit and total below.</p>` : ""}
      <form class="compact-form" data-budget-form novalidate>
        <label>Limit
          <input name="expenseLimit" type="number" min="0" step="0.01" value="${budget.expenseLimit}">
        </label>
        <label>Total budget
          <input name="totalBudget" type="number" min="0" step="0.01" value="${budget.totalBudget}">
        </label>
        <button type="submit">Save</button>
        <div data-budget-error></div>
      </form>
      <p>Spent ${formatMoney(spent)} / limit ${formatMoney(budget.expenseLimit)}</p>
      <p class="remaining ${remainingClass(remaining)}">Remaining ${formatMoney(remaining)}</p>
    </article>
  `;
}
