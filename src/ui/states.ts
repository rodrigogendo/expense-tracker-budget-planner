export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function emptyState(message: string, hint: string): string {
  return `<div class="view-state empty"><p>${escapeHtml(message)}</p><p class="hint">${escapeHtml(hint)}</p></div>`;
}

export function loadingState(message = "Loading…"): string {
  return `<div class="view-state loading">${escapeHtml(message)}</div>`;
}

export function errorState(message: string): string {
  return `<div class="view-state error" role="alert">${escapeHtml(message)}</div>`;
}

export function fieldError(message: string | undefined): string {
  if (!message) return "";
  return `<p class="field-error">${escapeHtml(message)}</p>`;
}
