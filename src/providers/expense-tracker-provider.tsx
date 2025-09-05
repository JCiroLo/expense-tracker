import React, { useMemo } from "react";
import { type QueryObserverResult, type RefetchOptions, useQuery } from "@tanstack/react-query";
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

      const templates = await $ExpenseTemplate.getAllIndexed({ userId: user.uid });

      if (templates.error) {
        throw templates.error;
      }

      const templatesIds = Object.keys(templates.data);

      const records = await $ExpenseRecord.getByTemplate({
        userId: user.uid,
        templateId: templatesIds,
        month: DateTools.month,
        year: DateTools.year,
      });

      if (records.error) {
        throw records.error;
      }

      const categories = await $ExpenseCategory.getAll({ userId: user.uid });

      return {
        templates: templates.data,
        records: records.data,
        categories: categories.error ? [] : categories.data,
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

    const indexed = ArrayTools.indexBy(data.records, (record) => record.template_id);

    const oneTimeRecords = data.records.filter((record) => {
      const template = (data.templates as Record<string, ExpenseTemplate>)[record.template_id];

      return template.type === "one-time";
    });

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

    const indexed = data.templates;
    const all = Object.values(indexed);
    const { annual, monthly } = Object.groupBy(all, (record) => record.type);

    const expired: ExpenseTemplate[] = [];
    const closeToExpire: ExpenseTemplate[] = [];
    const today = dayjs().startOf("day");

    (monthly || []).forEach((template) => {
      const dueDate = dayjs().date(template.due_day!).startOf("day");
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
      all,
      expired,
      closeToExpire,
      monthly: monthly || [],
      annual: annual || [],
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
