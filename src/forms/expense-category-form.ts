import type { ExpenseCategory } from "@/types/expense";
import type { KeysToCamelCase } from "@/types/utils";

export type ExpenseCategoryFormObject = KeysToCamelCase<Omit<ExpenseCategory, "id" | "user_id">>;

const ExpenseCategoryForm = {
  formKeys: {
    color: "category-color",
    name: "category-name",
  },
  toObject(formData: FormData): ExpenseCategoryFormObject {
    return {
      color: (formData.get(this.formKeys.color) as string) || "#000000",
      name: formData.get(this.formKeys.name) as string,
    };
  },
};

export default ExpenseCategoryForm;
