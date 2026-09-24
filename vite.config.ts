import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/expense-tracker-budget-planner/" : "/",
}));