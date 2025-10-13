import type { IncomeTemplate, IncomeType } from "@/types/income";
import type { KeysToCamelCase } from "@/types/utils";

export type IncomeTemplateFormObject = KeysToCamelCase<Omit<IncomeTemplate, "id" | "user_id">>;

const IncomeTemplateForm = {
  formKeys: {
    amount: "template-amount",
    categoryId: "template-category-id",
    dueDay: "template-due-day",
    dueMonth: "template-due-month",
    title: "template-title",
    type: "template-type",
  },
  toObject(formData: FormData): IncomeTemplateFormObject {
    const rawAmount = formData.get(this.formKeys.amount) as string;
    return {
      amount: Number(rawAmount.replaceAll(",", "")),
      categoryId: formData.get(this.formKeys.categoryId) as string,
      dueDay: Number(formData.get(this.formKeys.dueDay)) || null,
      dueMonth: Number(formData.get(this.formKeys.dueMonth)) || null,
      dueYear: Number(formData.get(this.formKeys.dueMonth)) || null,
      title: formData.get(this.formKeys.title) as string,
      type: formData.get(this.formKeys.type) as IncomeType,
    };
  },
};

export default IncomeTemplateForm;
