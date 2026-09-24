# Expense tracker and Budget planner

This project aims to be a fast and clean personal finance tool, allowing the user to track expenses, set category budgets, see remaining budget and review spending patterns.

## Functionalities

- Add / edit and delete expenses
- Adding an expense needs a title, value, category and date of transaction
- Create and track monthly budgets by categories and overall
- Small card at the top where the user can set a monthly total budget and then see budget, spent, and remaining totals
- The budget value will change according to the expenses and be green in case of positive or red in case of negative spending
- A dashboard with current month overview, remaining budget and recent transactions
- A sidebar on the left with the total expenses + total expenses by categories
- Right above the sidebar, two tabs that switch between Expenses and Savings. The main area uses a quick and simple visual sliding animation, while the sidebar switches panes without sliding to stay within its column
- Savings tab will allow the user to input an amount saved on a specific date
- A small card with basic reports with daily totals below the monthly budget summary
- Fixed categories for expenses: Housing, Utilities, Groceries, Transportation, Healthcare, Entertainment, Others

## Visual

- Clean and simple
- Neutral colors, grey shades, don't use too many areas with white
- Compact
- Cards with rounded borders
- Title at the top left: "$ Flux", not too big. Not much padding and margin

## Technical details

- Data won't persist
- Organized files/folders for types, functions, etc
- Use only 'type', not 'interface'
- Empty states, loading states and error states
- Vanilla Typescript, HTML and CSS only
- All events added on Typescript, not inline on HTML
- Simple code for easy maintenance