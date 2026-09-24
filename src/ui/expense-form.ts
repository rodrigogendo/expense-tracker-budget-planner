import { EXPENSE_CATEGORIES } from "../types/expense.ts";
import { todayISO } from "../functions/date.ts";
import { validateExpense } from "../functions/validate.ts";
import { addExpense, createId, getState, updateExpense } from "../state/store.ts";
import { fieldError } from "./states.ts";

let editingId: string | null = null;

export function startExpenseEdit(id: string): void {
  editingId = id;
}

export function bindExpenseForm(root: HTMLElement): void {
  root.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!(event.target instanceof HTMLFormElement)) return;
    const form = event.target;
    const data = new FormData(form);
    const result = validateExpense({
      title: String(data.get("title") ?? ""),
      value: String(data.get("value") ?? ""),
      category: String(data.get("category") ?? ""),
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
    if (errorBox) errorBox.innerHTML = "";

    const id = editingId;
    editingId = null;
    if (id) updateExpense(id, result.value);
    else addExpense({ id: createId(), ...result.value });
    renderExpenseForm(root, "ready");
  });

  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || target.dataset.action !== "cancel-edit") return;
    editingId = null;
    renderExpenseForm(root, "ready");
  });
}

export function renderExpenseForm(root: HTMLElement, status: "loading" | "ready"): void {
  if (status === "loading") {
    root.innerHTML = `<article class="card"><div class="view-state loading">Loading form…</div></article>`;
    return;
  }

  const editing = getState().expenses.find((item) => item.id === editingId);
  const title = editing?.title ?? "";
  const value = editing?.value ?? "";
  const category = editing?.category ?? "";
  const date = editing?.date ?? todayISO();
  const options = EXPENSE_CATEGORIES.map(
    (item) => `<option value="${item}" ${item === category ? "selected" : ""}>${item}</option>`,
  ).join("");

  root.innerHTML = `
    <article class="card">
      <h2>${editing ? "Edit expense" : "Add expense"}</h2>
      <form class="compact-form expense-form" data-expense-form novalidate>
        <label>Title
          <input name="title" type="text" value="${escapeAttr(String(title))}" required>
        </label>
        <label>Value
          <input name="value" type="number" min="0.01" step="0.01" value="${value}" required>
        </label>
        <label>Category
          <select name="category" required>
            <option value="">Select</option>
            ${options}
          </select>
        </label>
        <label>Date
          <input name="date" type="date" value="${date}" required>
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

function escapeAttr(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}
