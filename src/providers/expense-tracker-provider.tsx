import React, { useMemo } from "react";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Loader from "@/components/layout/loader";
import $ExpenseTemplate from "@/services/expense-template";
import $ExpenseRecord from "@/services/expense-record";
import useSessionStore from "@/stores/use-session-store";
import ArrayTools from "@/tools/array-tools";
import TrackerTools from "@/tools/tracker-tools";
import Env from "@/lib/env";
import { ExpenseRecord, ExpenseTemplate } from "@/types/expense";

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
  };
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

      const records = await $ExpenseRecord.getByTemplate({ userId: user.uid, templateId: templatesIds });

      if (!records.ok) {
        throw records.error;
      }

      return {
        templates: templates.data,
        records: records.data,
      };
    },
  });

  const records = useMemo(() => {
    console.log("calculating all records");

    if (!data?.records) {
      return {
        indexed: {} as Record<string, ExpenseRecord>,
        all: [] as ExpenseRecord[],
      };
    }

    const indexed = ArrayTools.indexBy(data.records, (record) =>
      TrackerTools.getRecordKey({
        templateId: record.templateId,
        type: record.templateType,
        date: record.paidAt,
      })
    );

    return { indexed, all: data.records };
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
      const dueDate = dayjs().date(template.dueDay).startOf("day");
      const diff = dueDate.diff(today, "day");
      const paid = records.indexed[TrackerTools.getRecordKey({ templateId: template.id, type: template.type })];

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
  }, [data]);

  return (
    <ExpenseTrackerContext.Provider
      value={{
        templates,
        records,
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
