import DateTools from "@/tools/date-tools";
import { ExpenseType } from "@/types/expense";
import { Timestamp } from "firebase/firestore";

const TrackerTools = {
  getRecordKey({ templateId, type, date }: { templateId: string; type: ExpenseType; date?: Date | Timestamp }): string {
    if (!date) date = DateTools.now;

    if (date instanceof Timestamp) date = date.toDate();

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return type === "monthly" ? `${templateId}|${year}|${month}` : `${templateId}|${year}`;
  },
};

export default TrackerTools;
