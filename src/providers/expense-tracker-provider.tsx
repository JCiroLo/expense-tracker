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

type ExenseTrackerFilters = {
  month: number;
  year: number;
};

type ExpenseTrackerContextType = {
  categories: ExpenseCategory[];
  filters: ExenseTrackerFilters;
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
  refresh: {
    categories: (options?: RefetchOptions) => Promise<QueryObserverResult>;
    templates: (options?: RefetchOptions) => Promise<QueryObserverResult>;
    records: (options?: RefetchOptions) => Promise<QueryObserverResult>;
    all: (options?: RefetchOptions) => Promise<QueryObserverResult>;
  };
  updateFilters: (newFilters: Partial<ExenseTrackerFilters>) => void;
};

type ExpenseTrackerProviderProps = {
  children: React.ReactNode;
};

const defaultRecords = {
  all: [] as ExpenseRecord[],
  indexed: {} as Record<string, ExpenseRecord>,
  oneTime: [] as ExpenseRecord[],
};

const defaultTemplates = {
  all: [] as ExpenseTemplate[],
  annual: [] as ExpenseTemplate[],
  closeToExpire: [] as ExpenseTemplate[],
  expired: [] as ExpenseTemplate[],
  indexed: {} as Record<string, ExpenseTemplate>,
  monthly: [] as ExpenseTemplate[],
};

const ExpenseTrackerContext = React.createContext<ExpenseTrackerContextType>(null!);

const ExpenseTrackerProvider: React.FC<ExpenseTrackerProviderProps> = ({ children }) => {
  const user = useSessionStore((state) => state.user);

  const [filters, setFilters] = React.useState<ExenseTrackerFilters>({
    month: DateTools.month,
    year: DateTools.year,
  });

  const categories = useQuery({
    queryKey: ["fetch-categories", user?.uid],
    queryFn: async () => {
      if (!user) {
        return [];
      }

      const { error, data } = await $ExpenseCategory.getAll({ userId: user.uid });

      if (error) {
        throw error;
      }

      console.log("fetched categories");

      return data;
    },
  });

  const templates = useQuery({
    queryKey: ["fetch-templates", user?.uid],
    queryFn: async () => {
      if (!user) {
        return defaultTemplates;
      }

      const { error, data } = await $ExpenseTemplate.getAllIndexed({ userId: user.uid });

      if (error) {
        throw error;
      }

      const all = Object.values(data);
      const { annual, monthly } = Object.groupBy(all, (record) => record.type);

      console.log("fetched templates");

      return {
        all,
        annual: annual || [],
        closeToExpire: [] as ExpenseTemplate[],
        expired: [] as ExpenseTemplate[],
        indexed: data,
        monthly: monthly || [],
      };
    },
  });

  const records = useQuery({
    enabled: Boolean(templates.data),
    queryKey: ["fetch-records", user?.uid, filters],
    queryFn: async () => {
      if (!user || !templates.data) {
        return defaultRecords;
      }

      const templatesIds = Object.keys(templates.data.indexed);

      const { error, data } = await $ExpenseRecord.getByTemplate({
        month: filters.month,
        templateId: templatesIds,
        userId: user.uid,
        year: filters.year,
      });

      if (error) {
        throw error;
      }

      const indexed = ArrayTools.indexBy(data, (record) => record.template_id);

      const oneTimeRecords = data.filter((record) => {
        const template = (templates.data.indexed as Record<string, ExpenseTemplate>)[record.template_id];

        return template.type === "one-time";
      });

      console.log("fetched records", data);

      return { indexed, all: data, oneTime: oneTimeRecords };
    },
  });

  const expiration = useMemo(() => {
    const today = dayjs().startOf("day");
    const expired: ExpenseTemplate[] = [];
    const closeToExpire: ExpenseTemplate[] = [];

    (templates.data?.monthly || []).forEach((template) => {
      const dueDate = dayjs().date(template.due_day!).startOf("day");
      const diff = dueDate.diff(today, "day");
      const paid = records.data?.indexed[template.id] || false;

      if (diff <= Env.MAX_DAYS_EXPIRATION_DANGER && !paid) {
        expired.push(template);
        return;
      }

      if (diff <= Env.MAX_DAYS_EXPIRATION_WARNING && !paid) {
        closeToExpire.push(template);
        return;
      }
    });

    return { closeToExpire, expired };
  }, [templates.data, records]);

  function updateFilters(newFilters: Partial<ExenseTrackerFilters>) {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }

  async function refetch(options?: RefetchOptions) {
    return Promise.all([categories.refetch(options), templates.refetch(options), records.refetch(options)]).then(([a]) => a);
  }

  return (
    <ExpenseTrackerContext.Provider
      value={{
        filters,
        updateFilters,
        categories: categories.data || [],
        templates: {
          ...(templates.data || defaultTemplates),
          closeToExpire: expiration.closeToExpire,
          expired: expiration.expired,
        },
        records: records.data || defaultRecords,
        refresh: {
          categories: categories.refetch,
          templates: templates.refetch,
          records: records.refetch,
          all: refetch,
        },
      }}
    >
      {children}
      <Loader show={categories.isLoading || templates.isLoading || records.isLoading} />
    </ExpenseTrackerContext.Provider>
  );
};

export { ExpenseTrackerContext };
export default ExpenseTrackerProvider;
