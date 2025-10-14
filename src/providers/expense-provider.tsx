import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import useFilters from "@/hooks/use-filters";
import $ExpenseRecord from "@/services/expense-record";
import $ExpenseTemplate from "@/services/expense-template";
import useSessionStore from "@/stores/use-session-store";
import ArrayTools from "@/tools/array-tools";
import Env from "@/lib/env";
import queryClient from "@/lib/query-client";
import Logger from "@/lib/logger";
import type { ExpenseRecord, ExpenseTemplate } from "@/types/expense";

type ExpenseContextType = {
  isLoading: boolean;
  queries: {
    templates: ReturnType<typeof useQuery>;
    records: ReturnType<typeof useQuery>;
  };
  templates: {
    all: ExpenseTemplate[];
    annual: ExpenseTemplate[];
    closeToExpire: ExpenseTemplate[];
    expired: ExpenseTemplate[];
    monthly: ExpenseTemplate[];
    oneTime: ExpenseTemplate[];
  };
  records: {
    indexed: Record<string, ExpenseRecord>;
    all: ExpenseRecord[];
    oneTime: ExpenseRecord[];
  };
  refresh: {
    templates: () => Promise<void>;
    records: () => Promise<void>;
    all: () => Promise<void>;
  };
};

type ExpenseProviderProps = {
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
  oneTime: [] as ExpenseTemplate[],
};

const ExpenseContext = React.createContext<ExpenseContextType>(null!);

const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const user = useSessionStore((state) => state.user);

  const { filters } = useFilters();

  const templates = useQuery({
    queryKey: ["fetch-expense-templates", user?.uid, filters],
    queryFn: async () => {
      if (!user) {
        return defaultTemplates;
      }

      const { error, data } = await $ExpenseTemplate.getAllIndexed({ month: filters.month, userId: user.uid, year: filters.year });

      if (error) {
        throw error;
      }

      const all = Object.values(data);
      const { annual, monthly, "one-time": oneTime } = Object.groupBy(all, (record) => record.type);

      Logger.log("fetched expense templates", data);

      return {
        all,
        annual: annual || [],
        closeToExpire: [] as ExpenseTemplate[],
        expired: [] as ExpenseTemplate[],
        indexed: data,
        monthly: monthly || [],
        oneTime: oneTime || [],
      };
    },
  });

  const records = useQuery({
    enabled: Boolean(templates.data),
    queryKey: ["fetch-expense-records", user?.uid, filters],
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

      Logger.log("fetched expense records", data);

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

      if (diff < Env.MAX_DAYS_EXPIRATION_DANGER && !paid) {
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

  async function refreshTemplates() {
    await queryClient.invalidateQueries({ queryKey: ["fetch-expense-templates", user?.uid, filters] });
  }

  async function refreshRecords() {
    await queryClient.invalidateQueries({ queryKey: ["fetch-expense-records", user?.uid, filters] });
  }

  async function refetch() {
    return Promise.all([refreshTemplates(), refreshRecords()]).then(([a]) => a);
  }

  return (
    <ExpenseContext.Provider
      value={{
        isLoading: templates.isLoading || records.isLoading,
        queries: {
          templates,
          records,
        },
        templates: {
          ...(templates.data || defaultTemplates),
          closeToExpire: expiration.closeToExpire,
          expired: expiration.expired,
        },
        records: records.data || defaultRecords,
        refresh: {
          templates: refreshTemplates,
          records: refreshRecords,
          all: refetch,
        },
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export { ExpenseContext };
export default ExpenseProvider;
