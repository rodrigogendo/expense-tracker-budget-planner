# $ Flux

A compact personal expense tracker and budget planner built with vanilla TypeScript, HTML, CSS, and Vite.

## Features

- Add, edit, and delete expenses
- Track current-month spending
- Set an overall monthly budget
- Set budgets by expense category
- View remaining budgets and spending totals
- Log, edit, and delete savings entries
- Responsive Expenses and Savings tabs
- In-memory session state with no persistence

## Requirements

- Node.js 22 or newer
- npm

## Development

Install dependencies:

```bash
npm ci
```

Start the local development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## GitHub Pages

The project is configured for the repository Pages URL:

`https://rodrigogendo.github.io/expense-tracker-budget-planner/`

Deployment is handled by [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). Pushes to `main` build the project and deploy the `dist` directory to GitHub Pages.

To enable deployment in GitHub, open **Settings > Pages** and set the source to **GitHub Actions**.

## Project Structure

```text
src/
  functions/   Pure date, money, and validation helpers
  state/       In-memory application store
  types/       TypeScript data types
  ui/          Rendering and event binding modules
  styles/      Application styles
```

## Data and Privacy

Data is stored only in memory and is cleared when the page is refreshed. The app does not use a backend, local storage, or a database.