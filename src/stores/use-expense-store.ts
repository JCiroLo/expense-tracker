import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import StoreTools from "@/lib/store-tools";
import { ExpenseRecord, ExpenseTemplate, ExpenseType } from "@/types/expense";

type ExpenseState = {
  templates: Record<ExpenseType, Record<string, ExpenseTemplate>>;
  records: Record<string, ExpenseRecord>;

  getTemplates: () => Record<ExpenseType | "all", ExpenseTemplate[]>;
  addTemplate: (template: Omit<ExpenseTemplate, "id">) => void;
  removeTemplate: (id: string, type: ExpenseType) => void;

  markAsPaid: (templateId: string, type: ExpenseType, date: Date) => void;
  isPaid: (templateId: string, type: ExpenseType, date: Date) => boolean;
  getTotalByDate: (
    date: Date
  ) => Record<ExpenseType, { expected: number; paid: number }>;
};

const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      templates: {
        monthly: {},
        annual: {},
      },
      records: {},

      getTemplates: () => {
        const templates = get().templates;

        const allTemplates = Object.values(templates.monthly)
          .concat(Object.values(templates.annual))
          .sort((a, b) => a.name.localeCompare(b.name));

        return {
          monthly: Object.values(templates.monthly),
          annual: Object.values(templates.annual),
          all: allTemplates,
        };
      },

      addTemplate: (template) => {
        const id = nanoid();

        set((state) => ({
          templates: {
            ...state.templates,
            [template.type]: {
              ...state.templates[template.type],
              [id]: { ...template, id },
            },
          },
        }));
      },

      removeTemplate: (id, type) =>
        set((state) => {
          const newTemplates = { ...state.templates };

          delete newTemplates[type][id];

          const newRecords = Object.fromEntries(
            Object.entries(state.records).filter(
              ([key]) => !key.startsWith(`${id}|`)
            )
          );

          return { templates: newTemplates, records: newRecords };
        }),

      markAsPaid: (templateId, type, date) => {
        const template = get().templates[type][templateId];

        if (!template) return;

        const key = StoreTools.getRecordKey(templateId, date, template.type);

        set((state) => ({
          records: {
            ...state.records,
            [key]: {
              templateId,
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              paid: true,
              paidAt: new Date().toISOString(),
            },
          },
        }));
      },

      isPaid: (templateId, type, date) => {
        const template = get().templates[type][templateId];

        if (!template) return false;

        const key = StoreTools.getRecordKey(templateId, date, template.type);

        return Boolean(get().records[key]?.paid);
      },

      getTotalByDate: (date) => {
        const templates = get().templates;
        const monthlyTemplates = Object.values(templates.monthly);
        const annualTemplates = Object.values(templates.annual);

        const calculateTotal = (templates: ExpenseTemplate[]) => {
          let expected = 0;
          let paid = 0;

          templates.forEach((t) => {
            expected += t.amount;

            const key = StoreTools.getRecordKey(t.id, date, t.type);

            if (get().records[key]?.paid) {
              paid += t.amount;
            }
          });

          return { expected, paid };
        };

        return {
          monthly: calculateTotal(monthlyTemplates),
          annual: calculateTotal(annualTemplates),
        };
      },
    }),
    {
      name: "expense-storage",
    }
  )
);

export default useExpenseStore;
