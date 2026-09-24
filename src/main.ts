import "./styles/main.css";
import { mountApp } from "./ui/render.ts";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing #app");
mountApp(app);
