export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function isCurrentMonth(isoDate: string, today = new Date()): boolean {
  const [year, month] = isoDate.split("-").map(Number);
  return year === today.getFullYear() && month === today.getMonth() + 1;
}
