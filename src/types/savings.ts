export const SAVINGS_FREQUENCIES = ["daily", "weekly", "monthly"] as const;

export type SavingsFrequency = (typeof SAVINGS_FREQUENCIES)[number];

export type SavingsEntry = {
  id: string;
  amount: number;
  frequency: SavingsFrequency;
};
