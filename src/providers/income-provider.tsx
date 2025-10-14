import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import useFilters from "@/hooks/use-filters";
import $IncomeRecord from "@/services/income-record";
import $IncomeTemplate from "@/services/income-template";
import useSessionStore from "@/stores/use-session-store";
import ArrayTools from "@/tools/array-tools";
import Env from "@/lib/env";
import queryClient from "@/lib/query-client";
import Logger from "@/lib/logger";
import type { IncomeRecord, IncomeTemplate } from "@/types/income";

type IncomeContextType = {
  isLoading: boolean;
  queries: {
    templates: ReturnType<typeof useQuery>;
    records: ReturnType<typeof useQuery>;
  };
  templates: {
    all: IncomeTemplate[];
    annual: IncomeTemplate[];
    monthly: IncomeTemplate[];
    oneTime: IncomeTemplate[];
    upcoming: IncomeTemplate[];
  };
  records: {
    indexed: Record<string, IncomeRecord>;
    all: IncomeRecord[];
    oneTime: IncomeRecord[];
  };
  refresh: {
    templates: () => Promise<void>;
    records: () => Promise<void>;
    all: () => Promise<void>;
  };
};

type IncomeProviderProps = {
  children: React.ReactNode;
};

const defaultRecords = {
  all: [] as IncomeRecord[],
  indexed: {} as Record<string, IncomeRecord>,
  oneTime: [] as IncomeRecord[],
};

const defaultTemplates = {
  all: [] as IncomeTemplate[],
  annual: [] as IncomeTemplate[],
  indexed: {} as Record<string, IncomeTemplate>,
  monthly: [] as IncomeTemplate[],
  oneTime: [] as IncomeTemplate[],
  upcoming: [] as IncomeTemplate[],
};

const IncomeContext = React.createContext<IncomeContextType>(null!);

const IncomeProvider: React.FC<IncomeProviderProps> = ({ children }) => {
  const user = useSessionStore((state) => state.user);

  const { filters } = useFilters();

  const templates = useQuery({
    queryKey: ["fetch-income-templates", user?.uid, filters],
    queryFn: async () => {
      if (!user) {
        return defaultTemplates;
      }

      const { error, data } = await $IncomeTemplate.getAllIndexed({ month: filters.month, userId: user.uid, year: filters.year });

      if (error) {
        throw error;
      }

      const all = Object.values(data);
      const { annual, monthly, "one-time": oneTime } = Object.groupBy(all, (record) => record.type);

      Logger.log("fetched income templates", data);

      return {
        all,
        annual: annual || [],
        expired: [] as IncomeTemplate[],
        indexed: data,
        monthly: monthly || [],
        oneTime: oneTime || [],
        upcoming: [] as IncomeTemplate[],
      };
    },
  });

  const records = useQuery({
    enabled: Boolean(templates.data),
    queryKey: ["fetch-income-records", user?.uid, filters],
    queryFn: async () => {
      if (!user || !templates.data) {
        return defaultRecords;
      }

      const templatesIds = Object.keys(templates.data.indexed);

      const { error, data } = await $IncomeRecord.getByTemplate({
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
        const template = (templates.data.indexed as Record<string, IncomeTemplate>)[record.template_id];

        return template.type === "one-time";
      });

      Logger.log("fetched income records", data);

      return { indexed, all: data, oneTime: oneTimeRecords };
    },
  });

  const expiration = useMemo(() => {
    const today = dayjs().startOf("day");
    const upcoming: IncomeTemplate[] = [];

    (templates.data?.monthly || []).forEach((template) => {
      const dueDate = dayjs().date(template.due_day!).startOf("day");
      const diff = dueDate.diff(today, "day");
      const paid = records.data?.indexed[template.id] || false;

      if (diff <= Env.MAX_DAYS_EXPIRATION_WARNING && !paid) {
        upcoming.push(template);
        return;
      }
    });

    return { upcoming };
  }, [templates.data, records]);

  async function refreshTemplates() {
    return await queryClient.invalidateQueries({ queryKey: ["fetch-income-templates", user?.uid, filters] });
  }

  async function refreshRecords() {
    return await queryClient.invalidateQueries({ queryKey: ["fetch-income-records", user?.uid, filters] });
  }

  async function refetch() {
    return Promise.all([refreshTemplates(), refreshRecords()]).then(([a]) => a);
  }

  return (
    <IncomeContext.Provider
      value={{
        isLoading: templates.isLoading || records.isLoading,
        queries: {
          templates,
          records,
        },
        templates: {
          ...(templates.data || defaultTemplates),
          upcoming: expiration.upcoming,
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
    </IncomeContext.Provider>
  );
};

export { IncomeContext };
export default IncomeProvider;
