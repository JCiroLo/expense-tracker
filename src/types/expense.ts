export type ExpenseType = "monthly" | "annual" | "one-time";

export type ExpenseTemplate = {
  amount: number;
  dueDay: number | null;
  dueMonth: number | null;
  id: string;
  title: string;
  type: ExpenseType;
  userId: string;
};

export type ExpenseRecord = {
  amount: number | null; // Not null for one-time payments
  id: string;
  paidAt: Date;
  paidAtMonth: number;
  paidAtYear: number;
  templateId: string | null;
  title: string | null; // Not null for one-time payments
  type: ExpenseType;
  userId: string;
};
