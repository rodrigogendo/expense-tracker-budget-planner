import { currentMonthExpenses, formatMoney, remainingClass, remainingOverall, totalSpent } from "../functions/money.ts";
import { getState, subscribe } from "../state/store.ts";
import { bindBudgetCard, renderBudgetCard } from "./budget-card.ts";
import { bindExpenseForm, renderExpenseForm } from "./expense-form.ts";
import { bindExpenseHistory, renderExpenseHistory } from "./expense-history.ts";
import { renderReportsCard } from "./reports-card.ts";
import {
  bindSavings,
  renderSavingsForm,
  renderSavingsList,
  renderSavingsSidebar,
} from "./savings.ts";
import { bindSidebar, renderExpenseSidebar } from "./sidebar.ts";
import { errorState, loadingState } from "./states.ts";
import { bindTabs, syncTabUI } from "./tabs.ts";

const template = `
  <div class="shell">
    <p class="brand">$ Flux</p>
    <div class="layout">
      <aside class="column-left">
        <div class="tabs" data-tabs>
          <button type="button" data-tab="expenses">Expenses</button>
          <button type="button" data-tab="savings">Savings</button>
        </div>
        <div class="sidebar-viewport">
          <div class="sidebar-pane active" data-sidebar-pane="expenses" id="sidebar-expenses"></div>
          <div class="sidebar-pane" data-sidebar-pane="savings" id="sidebar-savings" hidden></div>
        </div>
      </aside>
      <div class="column-right">
        <div id="budget-card"></div>
        <div id="reports-card"></div>
        <div class="slide-viewport">
          <div class="slide-track" data-slide>
            <div class="pane">
              <div id="remaining-card"></div>
              <div id="expense-form"></div>
              <div id="expense-history"></div>
            </div>
            <div class="pane">
              <div id="savings-form"></div>
              <div id="savings-list"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

type Status = "loading" | "ready" | "error";

export function mountApp(app: HTMLElement): void {
  app.innerHTML = template;
  bindTabs(app);
  bindBudgetCard(must(app, "#budget-card"));
  bindSidebar(must(app, "#sidebar-expenses"));
  bindExpenseForm(must(app, "#expense-form"));
  bindExpenseHistory(must(app, "#expense-history"), must(app, "#expense-form"));
  bindSavings(must(app, "#savings-form"), must(app, "#savings-list"));

  paint(app, "loading");
  subscribe(() => paint(app, "ready"));
  window.setTimeout(() => paint(app, "ready"), 180);
}

function paint(app: HTMLElement, status: Status): void {
  try {
    const state = getState();
    syncTabUI(app, state.tab);
    renderBudgetCard(must(app, "#budget-card"), status === "loading" ? "loading" : "ready");
    renderReportsCard(must(app, "#reports-card"), status === "loading" ? "loading" : "ready");
    renderExpenseSidebar(must(app, "#sidebar-expenses"), status === "loading" ? "loading" : "ready");
    renderSavingsSidebar(must(app, "#sidebar-savings"), status === "loading" ? "loading" : "ready");
    renderRemaining(must(app, "#remaining-card"), status);
    renderIfIdle(must(app, "#expense-form"), () =>
      renderExpenseForm(must(app, "#expense-form"), status === "loading" ? "loading" : "ready"),
    );
    renderExpenseHistory(must(app, "#expense-history"), status === "loading" ? "loading" : "ready");
    renderIfIdle(must(app, "#savings-form"), () =>
      renderSavingsForm(must(app, "#savings-form"), status === "loading" ? "loading" : "ready"),
    );
    renderSavingsList(must(app, "#savings-list"), status === "loading" ? "loading" : "ready");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    app.innerHTML = errorState(message);
  }
}

function renderRemaining(root: HTMLElement, status: Status): void {
  if (status === "loading") {
    root.innerHTML = `<article class="card">${loadingState("Loading overview…")}</article>`;
    return;
  }

  const { budget, expenses } = getState();
  const spent = totalSpent(currentMonthExpenses(expenses));
  const remaining = remainingOverall(budget.totalBudget, spent);
  root.innerHTML = `
    <article class="card">
      <h2>This month</h2>
      <p>Spent ${formatMoney(spent)} / budget ${formatMoney(budget.totalBudget)}</p>
      <p class="remaining ${remainingClass(remaining)}">Remaining ${formatMoney(remaining)}</p>
    </article>
  `;
}

function renderIfIdle(root: HTMLElement, render: () => void): void {
  if (root.contains(document.activeElement)) return;
  render();
}

function must(root: HTMLElement, selector: string): HTMLElement {
  const node = root.querySelector<HTMLElement>(selector);
  if (!node) throw new Error(`Missing ${selector}`);
  return node;
}
