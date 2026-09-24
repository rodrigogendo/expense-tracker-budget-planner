import { currentMonthExpenses, dailyTotals, formatMoney } from "../functions/money.ts";
import { getState } from "../state/store.ts";
import { emptyState, loadingState } from "./states.ts";

export function renderReportsCard(root: HTMLElement, status: "loading" | "ready"): void {
  if (status === "loading") {
    root.innerHTML = `<article class="card">${loadingState("Loading reports…")}</article>`;
    return;
  }

  const rows = dailyTotals(currentMonthExpenses(getState().expenses));
  const body =
    rows.length === 0
      ? emptyState("No daily totals this month.", "Add an expense to see spending by day.")
      : `<ul class="daily-list">${rows
          .map((row) => `<li><span>${row.date}</span><span>${formatMoney(row.total)}</span></li>`)
          .join("")}</ul>`;

  root.innerHTML = `
    <article class="card">
      <h2>Daily totals</h2>
      ${body}
    </article>
  `;
}
