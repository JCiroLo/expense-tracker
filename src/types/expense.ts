export type ExpenseType = "monthly" | "annual";

export type ExpenseTemplate = {
  id: string;
  userId: string;
  title: string;
  amount: number;
  dueDay: number;
  type: ExpenseType;
};

export type ExpenseRecord = {
  id: string;
  templateId: string;
  templateType: ExpenseType;
  userId: string;
  year: number;
  month: number | null;
  paidAt: Date;
  cancelled: boolean;
  cancelledAt: string | null;
};
