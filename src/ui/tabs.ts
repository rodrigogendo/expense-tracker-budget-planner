import { setTab } from "../state/store.ts";
import type { AppTab } from "../types/ui.ts";

export function bindTabs(root: HTMLElement): void {
  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const tab = target.dataset.tab;
    if (tab !== "expenses" && tab !== "savings") return;
    setTab(tab);
  });
}

export function syncTabUI(root: HTMLElement, tab: AppTab): void {
  root.querySelectorAll<HTMLElement>("[data-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  root.querySelectorAll<HTMLElement>("[data-slide]").forEach((track) => {
    track.classList.toggle("show-savings", tab === "savings");
  });
}
