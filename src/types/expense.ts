export type ExpenseType = "monthly" | "annual";

export type ExpenseTemplate = {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  type: ExpenseType;
};

export type ExpenseRecord = {
  templateId: string;
  year: number;
  month?: number;
  paid: boolean;
  paidAt: string;
};
