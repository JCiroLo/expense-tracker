import { ExpenseType } from "@/types/expense";

const StoreTools = {
  getRecordKey(templateId: string, date: Date, type: ExpenseType): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return type === "monthly"
      ? `${templateId}|${year}|${month}`
      : `${templateId}|${year}`;
  },
};

export default StoreTools;
