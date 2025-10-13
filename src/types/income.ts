export type IncomeType = "monthly" | "annual" | "one-time";

export type IncomeTemplate = {
  amount: number;
  category_id: string | null;
  due_day: number | null;
  due_month: number | null;
  due_year: number | null;
  id: string;
  title: string;
  type: IncomeType;
  user_id: string;
};

export type IncomeRecord = {
  category_id: string | null;
  created_at: string;
  id: string;
  paid_at_month: number;
  paid_at_year: number;
  template_id: string;
  user_id: string;
};
