import React, { useMemo } from "react";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Loader from "@/components/layout/loader";
import $ExpenseCategory from "@/services/expense-category";
import $ExpenseRecord from "@/services/expense-record";
import $ExpenseTemplate from "@/services/expense-template";
import useSessionStore from "@/stores/use-session-store";
import ArrayTools from "@/tools/array-tools";
import DateTools from "@/tools/date-tools";
import Env from "@/lib/env";
import type { ExpenseCategory, ExpenseRecord, ExpenseTemplate } from "@/types/expense";

type ExpenseTrackerContextType = {
  templates: {
    expired: ExpenseTemplate[];
    closeToExpire: ExpenseTemplate[];
    monthly: ExpenseTemplate[];
    annual: ExpenseTemplate[];
    all: ExpenseTemplate[];
  };
  records: {
    indexed: Record<string, ExpenseRecord>;
    all: ExpenseRecord[];
    oneTime: ExpenseRecord[]; // Pagos únicos del mes actual
  };
  categories: ExpenseCategory[];
  refresh: (options?: RefetchOptions) => Promise<QueryObserverResult>;
};

type ExpenseTrackerProviderProps = {
  children: React.ReactNode;
};

const ExpenseTrackerContext = React.createContext<ExpenseTrackerContextType>(null!);

const ExpenseTrackerProvider: React.FC<ExpenseTrackerProviderProps> = ({ children }) => {
  const user = useSessionStore((state) => state.user);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["get-templates-and-records"],
    queryFn: async () => {
      if (!user) {
        return {
          templates: [],
          records: [],
        };
      }

      const templates = await $ExpenseTemplate.getAll({ userId: user.uid });

      if (!templates.ok) {
        throw templates.error;
      }

      const templatesIds = templates.data.map((template) => template.id);

      const records = await $ExpenseRecord.getByTemplate({
        userId: user.uid,
        templateId: templatesIds,
        month: DateTools.month,
        year: DateTools.year,
      });

      if (!records.ok) {
        throw records.error;
      }

      const categories = await $ExpenseCategory.getAll({ userId: user.uid });

      return {
        templates: templates.data,
        records: records.data,
        categories: categories.ok ? categories.data : [],
      };
    },
  });

  const records = useMemo(() => {
    console.log("calculating all records");

    if (!data?.records) {
      return {
        indexed: {} as Record<string, ExpenseRecord>,
        all: [] as ExpenseRecord[],
        oneTime: [] as ExpenseRecord[],
      };
    }

    const indexed = ArrayTools.indexBy(data.records, (record) => record.templateId!);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const oneTimeRecords = data.records.filter(
      (record) => record.type === "one-time" && record.paidAtYear === currentYear && record.paidAtMonth === currentMonth
    );

    return { indexed, all: data.records, oneTime: oneTimeRecords };
  }, [data]);

  const templates = useMemo(() => {
    if (!data?.templates) {
      return {
        expired: [],
        closeToExpire: [],
        monthly: [],
        annual: [],
        all: [],
      };
    }

    const sorted = Object.groupBy(data.templates, (record) => record.type);

    const expired: ExpenseTemplate[] = [];
    const closeToExpire: ExpenseTemplate[] = [];
    const today = dayjs().startOf("day");

    (sorted.monthly || []).forEach((template) => {
      const dueDate = dayjs().date(template.dueDay!).startOf("day");
      const diff = dueDate.diff(today, "day");
      const paid = records.indexed[template.id];

      if (diff <= Env.MAX_DAYS_EXPIRATION_DANGER && !paid) {
        expired.push(template);
        return;
      }

      if (diff <= Env.MAX_DAYS_EXPIRATION_WARNING && !paid) {
        closeToExpire.push(template);
        return;
      }
    });

    return {
      expired,
      closeToExpire,
      monthly: sorted.monthly || [],
      annual: sorted.annual || [],
      all: data.templates,
    };
  }, [data, records.indexed]);

  const categories = useMemo(() => {
    if (!data?.categories) {
      return [];
    }

    return data.categories;
  }, [data]);

  return (
    <ExpenseTrackerContext.Provider
      value={{
        templates,
        records,
        categories,
        refresh: refetch,
      }}
    >
      {children}
      <Loader show={isLoading} />
    </ExpenseTrackerContext.Provider>
  );
};

export { ExpenseTrackerContext };
export default ExpenseTrackerProvider;
