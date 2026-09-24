import { formatMoney } from "../functions/money.ts";
import { deleteExpense, getState } from "../state/store.ts";
import { emptyState, escapeHtml, loadingState } from "./states.ts";
import { renderExpenseForm, startExpenseEdit } from "./expense-form.ts";

export function bindExpenseHistory(root: HTMLElement, formRoot: HTMLElement): void {
  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const id = target.dataset.id;
    if (!id) return;

    if (target.dataset.action === "edit") {
      startExpenseEdit(id);
      renderExpenseForm(formRoot, "ready");
      return;
    }

    if (target.dataset.action === "delete") {
      deleteExpense(id);
    }
  });
}

export function renderExpenseHistory(root: HTMLElement, status: "loading" | "ready"): void {
  if (status === "loading") {
    root.innerHTML = `<article class="card">${loadingState("Loading history…")}</article>`;
    return;
  }

  const newestFirst = [...getState().expenses].reverse();
  const body =
    newestFirst.length === 0
      ? emptyState("No transactions yet.", "Add an expense with the form above.")
      : `<ul class="history-list">${newestFirst
          .map(
            (item) => `
          <li>
            <span>${escapeHtml(item.title)} — ${formatMoney(item.value)} — ${item.category} — ${item.date}</span>
            <span class="row-actions">
              <button type="button" data-action="edit" data-id="${item.id}">Edit</button>
              <button type="button" data-action="delete" data-id="${item.id}">Delete</button>
            </span>
          </li>`,
          )
          .join("")}</ul>`;

  root.innerHTML = `
    <article class="card">
      <h2>Transaction history</h2>
      ${body}
    </article>
  `;
}
