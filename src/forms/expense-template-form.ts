import type { ExpenseTemplate, ExpenseType } from "@/types/expense";
import type { KeysToCamelCase } from "@/types/utils";

export type ExpenseTemplateFormObject = KeysToCamelCase<Omit<ExpenseTemplate, "id" | "user_id">>;

const ExpenseTemplateForm = {
  formKeys: {
    amount: "template-amount",
    categoryId: "template-category-id",
    dueDay: "template-due-day",
    dueMonth: "template-due-month",
    title: "template-title",
    type: "template-type",
  },
  toObject(formData: FormData): ExpenseTemplateFormObject {
    const rawAmount = formData.get(this.formKeys.amount) as string;
    return {
      amount: Number(rawAmount.replaceAll(",", "")),
      categoryId: formData.get(this.formKeys.categoryId) as string,
      dueDay: Number(formData.get(this.formKeys.dueDay)) || null,
      dueMonth: Number(formData.get(this.formKeys.dueMonth)) || null,
      title: formData.get(this.formKeys.title) as string,
      type: formData.get(this.formKeys.type) as ExpenseType,
    };
  },
};

export default ExpenseTemplateForm;
