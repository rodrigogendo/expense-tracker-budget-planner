# $ Flux — Product Requirements Document

**Product:** Expense tracker and budget planner  
**Working title:** $ Flux  
**Goal:** A fast, compact personal finance tool to track expenses, set category and overall monthly budgets, see remaining budget, log savings, and review spending patterns.  
**Stack:** Vanilla TypeScript, HTML, and CSS (Vite). No frameworks.  
**Persistence:** None. All data lives in memory for the session.

---

## Functionalities

### 1. Expenses

Users can add, edit, and delete expenses.

**Expense fields (all required):**


| Field    | Type   | Rules                               |
| -------- | ------ | ----------------------------------- |
| Title    | string | Non-empty, trimmed                  |
| Value    | number | Positive amount (> 0)               |
| Category | enum   | One of the fixed categories below   |
| Date     | date   | Transaction date; defaults to today |


**Fixed expense categories (not user-editable):**

- Housing
- Utilities
- Groceries
- Transportation
- Healthcare
- Entertainment
- Others

**Behaviors:**

- Add: form in the main area; submitting appends the expense and refreshes totals, remaining budget, sidebar, reports, and transaction history.
- Edit: same fields as add; saving replaces the existing record by id and updates the history row.
- Delete: removes the record immediately and refreshes all derived views, including history.
- Invalid input (empty title, non-numeric or non-positive value, missing category/date) shows an error state on the form; the expense is not saved.



### 2. Monthly budgets

Users set and track budgets for the current calendar month.

**Overall budget**

- A compact card at the top lets the user set the **total budget**.
- After saving, the card shows the total budget, total spent, and remaining budget.
- Remaining budget = total budget − sum of expenses in the current month.
- Remaining amount is **green** when ≥ 0 and **red** when negative (overspent).
- Changing the limit or total budget recalculates remaining budget and reports immediately.

**Category budgets**

- User can set a monthly budget per fixed category.
- Each category shows: spent this month, budget, remaining (same green/red rule).
- Overall remaining and category remaining stay in sync with expense CRUD.

Budgets apply to the current month only (no month picker in v1). Expenses dated outside the current month still count in session state, but monthly totals, remaining budget, and category spend use current-month dates only.

### 3. Dashboard (Expenses tab — main area)

Shows a current-month overview:

- Remaining budget (tied to the top budget card)
- Add / edit expense form
- **Transaction history** of every expense in the session

Each history row shows exactly what the user submitted, in this order:

**title — value — category — date**

History is the full list (not a “recent” subset). Newest first. Edit and delete act on a row in this list.

Empty dashboard: empty state when there are no expenses yet. Loading state if a brief in-memory “boot” render is used. Error state if a calculation or form submission fails.

### 4. Sidebar (left)

**Placement:** Left column. Directly above the sidebar, two tabs: **Expenses** | **Savings**.

**Expenses tab — sidebar content:**

- Total expenses (current month)
- Total expenses by category (all fixed categories; 0 if none)

**Savings tab — sidebar + main area:**

- User logs an amount saved with a **date**.
- Saved entries appear in the savings main view and contribute to a savings total for the session.
- Sidebar on Savings shows the overall savings total and entry count.

**Tab switch:** Sidebar and main area switch together with a short, simple sliding animation. No page reload.

### 5. Reports card

A small card **below** the expense-limit / total-budget card:

- Basic reports: **daily totals** for the current month (sum of expenses per day)
- Days with no expenses can be omitted or shown as 0; keep the card compact
- Updates whenever expenses change



### 6. Savings

- Input: amount + date
- Add / edit / delete savings entries in the Savings tab
- Amount must be positive
- No persistence across refresh (same as expenses)



### 7. UI states (product requirement)

Every list, form, and summary surface must support:

- **Empty:** no expenses / no savings / no budgets set — short copy and a path to add
- **Loading:** brief placeholder while the view first renders
- **Error:** validation or unexpected failure — message, no silent fail

---



## Visual



### Layout

```
┌─────────────────────────────────────────────────────────┐
│ $ Flux                                                  │  ← title, top-left, small
├──────────────┬──────────────────────────────────────────┤
│ Expenses |   │  [ Limit + Total budget card ]           │
│ Savings      │  [ Daily totals reports card ]           │
│              │                                          │
│ Sidebar      │  Dashboard / Savings main                │
│ totals +     │  remaining + form + transaction history  │
│ by category  │                                          │
└──────────────┴──────────────────────────────────────────┘
```

- Compact: tight spacing, low padding and margin, especially around the title.
- Title `$ Flux` top-left, not large.
- Cards: rounded corners, grey surfaces, not large white panels.
- Left: tabs then sidebar. Right: budget card, reports card, then main content.



### Look and feel


| Token       | Direction                                      |
| ----------- | ---------------------------------------------- |
| Style       | Clean, simple, compact                         |
| Palette     | Neutral greys; avoid large white regions       |
| Surfaces    | Cards on grey background, rounded borders      |
| Remaining + | Green when on/under budget                     |
| Remaining − | Red when overspent                             |
| Motion      | Tab switch: short, simple horizontal slide     |
| Density     | High information density; no oversized headers |




### Interaction

- All clicks, submits, and input handling from TypeScript (no inline HTML handlers).
- Tab animation should feel instant (roughly 200–300ms), not decorative.
- Forms stay compact: labels + inputs in a short row or tight stack.

---



## Technical



### Constraints

- Vanilla **TypeScript**, **HTML**, and **CSS** only. No React/Vue/Svelte or UI libraries.
- Vite app: `index.html` mounts `#app`; `src/main.ts` is the entry.
- **No persistence:** no `localStorage`, IndexedDB, or backend. Refresh resets state.
- Use `type` **aliases only** — never `interface`.
- Keep code small and easy to maintain: pure functions for money math, thin UI modules.
- Events bound in TypeScript (`addEventListener`), never `onclick=` in HTML.



### Suggested folder layout

```
src/
  main.ts                 # boot, initial render
  types/
    expense.ts
    budget.ts
    savings.ts
    ui.ts
  state/
    store.ts              # in-memory state + subscribers
  functions/
    money.ts              # remaining, totals, daily aggregates
    date.ts               # current month filters
    validate.ts           # form validation
  ui/
    render.ts             # compose layout
    tabs.ts               # Expenses / Savings + slide
    budget-card.ts
    reports-card.ts
    sidebar.ts
    expense-form.ts
    expense-history.ts    # title — value — category — date
    savings.ts
    states.ts             # empty / loading / error helpers
  styles/
    main.css
```

Exact file names can vary; keep **types**, **functions**, and **UI** separated.

### Data model (types, not interfaces)

```ts
type ExpenseCategory =
  | "Housing"
  | "Utilities"
  | "Groceries"
  | "Transportation"
  | "Healthcare"
  | "Entertainment"
  | "Others";

type Expense = {
  id: string;
  title: string;
  value: number;
  category: ExpenseCategory;
  date: string; // ISO date YYYY-MM-DD
};

type MonthlyBudget = {
  totalBudget: number;
  byCategory: Record<ExpenseCategory, number>;
};

type SavingsEntry = {
  id: string;
  amount: number;
  date: string; // ISO date YYYY-MM-DD
};

type AppTab = "expenses" | "savings";

type AppState = {
  tab: AppTab;
  expenses: Expense[];
  savings: SavingsEntry[];
  budget: MonthlyBudget;
};
```

Money is stored as numbers (currency units). Format for display with a small helper (e.g. two decimals). Do not mix string and number amounts in state.

### Derived values (pure functions)


| Function               | Input                           | Output                      |
| ---------------------- | ------------------------------- | --------------------------- |
| Current-month expenses | expenses, today                 | filtered list               |
| Total spent            | month expenses                  | number                      |
| Spent by category      | month expenses                  | record of category → number |
| Remaining overall      | totalBudget, total spent        | number (green/red in UI)    |
| Remaining by category  | category budget, category spent | number                      |
| Daily totals           | month expenses                  | `{ date, total }[]`         |
| Savings total          | savings entries                 | number                      |




### Rendering

- Build DOM from TypeScript (or static HTML shell + TS updates). Prefer a small render pass after each state change.
- Subscribe to the in-memory store; do not scatter mutations across UI files.
- Loading / empty / error: dedicated helpers so lists and cards stay consistent.



### Tab animation

- CSS transform/transition on a sliding panel (Expenses vs Savings).
- TypeScript only toggles a class or `tab` in state; CSS owns the motion.



### Out of scope (v1)

- Auth, multi-user, accounts
- Persistence and export/import
- Custom categories
- Historical month navigation
- Charts beyond the daily-totals card
- Recurring expenses
- Multiple currencies

---



## Acceptance checklist

- [x] Add, edit, and delete expenses with title, value, category, date
- [x] Categories limited to the seven fixed values
- [x] Top card sets the monthly total budget and shows spent and remaining amounts
- [x] Remaining budget turns green (≥ 0) or red (< 0)
- [x] Category budgets and category spend visible in the sidebar
- [x] Dashboard shows current month overview, remaining budget, and transaction history (title — value — category — date)
- [x] Reports card under the budget card shows daily totals
- [x] Expenses / Savings tabs sit above the sidebar; both panes slide on switch
- [x] Savings accepts an amount and date
- [x] Title `$ Flux` is small, top-left, compact spacing
- [x] Neutral grey UI, rounded cards, not large white blocks
- [x] No data after refresh
- [x] `type` only, organized folders, events only in TypeScript
- [x] Empty, loading, and error states on primary views