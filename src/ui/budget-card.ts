import { currentMonthExpenses, formatMoney, remainingClass, remainingOverall, totalSpent } from "../functions/money.ts";
import { parseNonNegativeNumber } from "../functions/validate.ts";
import { getState, setTotalBudget } from "../state/store.ts";
import { fieldError, loadingState } from "./states.ts";

export function bindBudgetCard(root: HTMLElement): void {
  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || target.dataset.action !== "edit-budget") return;

    const { budget } = getState();
    renderBudgetForm(root, budget.totalBudget);
  });

  root.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!(event.target instanceof HTMLFormElement)) return;

    const form = event.target;
    const data = new FormData(form);
    const total = parseNonNegativeNumber(String(data.get("totalBudget") ?? ""));
    const errorBox = form.querySelector("[data-budget-error]");

    if (total === null) {
      if (errorBox) errorBox.innerHTML = fieldError("Enter 0 or a positive amount.");
      return;
    }

    if (errorBox) errorBox.innerHTML = "";
    setTotalBudget(total);
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
  const noBudget = budget.totalBudget === 0;

  if (noBudget) {
    renderBudgetForm(root);
    return;
  }

  root.innerHTML = `
    <article class="card">
      <h2>Monthly budget</h2>
      <div class="budget-summary">
        <div class="budget-metric">
          <span>Budget</span>
          <strong>${formatMoney(budget.totalBudget)}</strong>
        </div>
        <div class="budget-metric">
          <span>Spent</span>
          <strong>${formatMoney(spent)}</strong>
        </div>
        <div class="budget-metric ${remainingClass(remaining)}">
          <span>Remaining</span>
          <strong>${formatMoney(remaining)}</strong>
        </div>
      </div>
      <div class="budget-summary-actions">
        <button type="button" data-action="edit-budget">Edit</button>
      </div>
    </article>
  `;
}

function renderBudgetForm(root: HTMLElement, totalBudget = 0): void {
  root.innerHTML = `
    <article class="card">
      <h2>Monthly budget</h2>
      ${totalBudget === 0 ? `<p class="hint">Set a budget to track your spending progress.</p>` : ""}
      <form class="compact-form" data-budget-form novalidate>
        <label>Budget
          <input name="totalBudget" type="number" min="0" step="0.01" value="${totalBudget || ""}" placeholder="0">
        </label>
        <button type="submit">Save</button>
        <div data-budget-error></div>
      </form>
    </article>
  `;
}
