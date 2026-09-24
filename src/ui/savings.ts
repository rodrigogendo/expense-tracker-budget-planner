import { SAVINGS_FREQUENCIES } from "../types/savings.ts";
import {
  formatMoney,
  savingsByFrequency,
  savingsTotal,
} from "../functions/money.ts";
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
      frequency: String(data.get("frequency") ?? ""),
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
  const options = SAVINGS_FREQUENCIES.map(
    (item) =>
      `<option value="${item}" ${item === editing?.frequency ? "selected" : ""}>${item}</option>`,
  ).join("");

  root.innerHTML = `
    <article class="card">
      <h2>${editing ? "Edit savings" : "Log savings"}</h2>
      <form class="compact-form" data-savings-form novalidate>
        <label>Amount
          <input name="amount" type="number" min="0.01" step="0.01" value="${editing?.amount ?? ""}">
        </label>
        <label>Frequency
          <select name="frequency">
            <option value="">Select</option>
            ${options}
          </select>
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
      ? emptyState("No savings logged yet.", "Add an amount and frequency above.")
      : `<ul class="history-list">${newestFirst
          .map(
            (item) => `
          <li>
            <span>${formatMoney(item.amount)} — ${escapeHtml(item.frequency)}</span>
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
  const byFrequency = savingsByFrequency(entries);
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
      <ul class="category-list">
        <li><div class="category-row"><span>Daily</span><span>${formatMoney(byFrequency.daily)}</span></div></li>
        <li><div class="category-row"><span>Weekly</span><span>${formatMoney(byFrequency.weekly)}</span></div></li>
        <li><div class="category-row"><span>Monthly</span><span>${formatMoney(byFrequency.monthly)}</span></div></li>
      </ul>
    </div>
  `;
}
