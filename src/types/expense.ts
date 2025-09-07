export type ExpenseType = "monthly" | "annual" | "one-time";

export type ExpenseCategory = {
  color: string;
  id: string;
  name: string;
  user_id: string;
};

export type ExpenseTemplate = {
  amount: number;
  category_id: string | null;
  due_day: number | null;
  due_month: number | null;
  due_year: number | null;
  id: string;
  title: string;
  type: ExpenseType;
  user_id: string;
};

export type ExpenseRecord = {
  category_id: string | null;
  created_at: string;
  id: string;
  paid_at_month: number;
  paid_at_year: number;
  template_id: string;
  user_id: string;
};
