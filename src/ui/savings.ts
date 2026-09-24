import {
  formatMoney,
  savingsTotal,
} from "../functions/money.ts";
import { todayISO } from "../functions/date.ts";
import { validateSavings } from "../functions/validate.ts";
import {
  addSavings,
  createId,
  deleteSavings,
  getState,
  updateSavings,
} from "../state/store.ts";
import { emptyState, escapeHtml, fieldError, loadingState } from "./states.ts";

let editingId: string | null = null;

export function bindSavings(formRoot: HTMLElement, listRoot: HTMLElement): void {
  formRoot.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!(event.target instanceof HTMLFormElement)) return;
    const form = event.target;
    const data = new FormData(form);
    const result = validateSavings({
      amount: String(data.get("amount") ?? ""),
      date: String(data.get("date") ?? ""),
    });
    const errorBox = form.querySelector("[data-form-error]");

    if (!result.ok) {
      if (errorBox) {
        errorBox.innerHTML = Object.values(result.errors).map((message) => fieldError(message)).join("");
      }
      form.classList.add("has-error");
      return;
    }

    form.classList.remove("has-error");
    const id = editingId;
    editingId = null;
    if (id) updateSavings(id, result.value);
    else addSavings({ id: createId(), ...result.value });
    renderSavingsForm(formRoot, "ready");
  });

  formRoot.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || target.dataset.action !== "cancel-edit") return;
    editingId = null;
    renderSavingsForm(formRoot, "ready");
  });

  listRoot.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const id = target.dataset.id;
    if (!id) return;
    if (target.dataset.action === "edit") {
      editingId = id;
      renderSavingsForm(formRoot, "ready");
      return;
    }
    if (target.dataset.action === "delete") deleteSavings(id);
  });
}

export function renderSavingsForm(root: HTMLElement, status: "loading" | "ready"): void {
  if (status === "loading") {
    root.innerHTML = `<article class="card">${loadingState("Loading savings…")}</article>`;
    return;
  }

  const editing = getState().savings.find((item) => item.id === editingId);
  root.innerHTML = `
    <article class="card">
      <h2>${editing ? "Edit savings" : "Log savings"}</h2>
      <form class="compact-form" data-savings-form novalidate>
        <label>Amount
          <input name="amount" type="number" min="0.01" step="0.01" value="${editing?.amount ?? ""}">
        </label>
        <label>Date
          <input name="date" type="date" value="${editing?.date ?? todayISO()}" required>
        </label>
        <div class="form-actions">
          <button type="submit">${editing ? "Save" : "Add"}</button>
          ${editing ? `<button type="button" data-action="cancel-edit">Cancel</button>` : ""}
        </div>
        <div data-form-error></div>
      </form>
    </article>
  `;
}

export function renderSavingsList(root: HTMLElement, status: "loading" | "ready"): void {
  if (status === "loading") {
    root.innerHTML = `<article class="card">${loadingState("Loading savings…")}</article>`;
    return;
  }

  const newestFirst = [...getState().savings].reverse();
  const body =
    newestFirst.length === 0
      ? emptyState("No savings logged yet.", "Add an amount and date above.")
      : `<ul class="history-list">${newestFirst
          .map(
            (item) => `
          <li>
            <span>${formatMoney(item.amount)} — ${escapeHtml(item.date)}</span>
            <span class="row-actions">
              <button type="button" data-action="edit" data-id="${item.id}">Edit</button>
              <button type="button" data-action="delete" data-id="${item.id}">Delete</button>
            </span>
          </li>`,
          )
          .join("")}</ul>`;

  root.innerHTML = `
    <article class="card">
      <h2>Savings entries</h2>
      ${body}
    </article>
  `;
}

export function renderSavingsSidebar(root: HTMLElement, status: "loading" | "ready"): void {
  if (status === "loading") {
    root.innerHTML = loadingState("Loading savings…");
    return;
  }

  const entries = getState().savings;
  if (entries.length === 0) {
    root.innerHTML = `
      <div class="sidebar-block">
        <h2>Savings</h2>
        ${emptyState("No savings yet.", "Log an amount in the main view.")}
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <div class="sidebar-block">
      <h2>Savings</h2>
      <p class="total">Total ${formatMoney(savingsTotal(entries))}</p>
      <p class="hint">${entries.length} ${entries.length === 1 ? "entry" : "entries"} logged</p>
    </div>
  `;
}
