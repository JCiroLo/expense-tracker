export type ExpenseType = "monthly" | "annual" | "one-time";

export type ExpenseCategory = {
  color: string;
  id: string;
  name: string;
  userId: string;
};

export type ExpenseTemplate = {
  amount: number;
  categoryId: string;
  dueDay: number | null;
  dueMonth: number | null;
  id: string;
  title: string;
  type: ExpenseType;
  userId: string;
};

export type ExpenseRecord = {
  // Common fields
  categoryId: string;
  id: string;
  paidAt: Date;
  paidAtMonth: number;
  paidAtYear: number;
  templateId: string | null;
  type: ExpenseType;
  userId: string;
} & {
  // One-time expense fields
  amount: number | null;
  title: string | null;
};
