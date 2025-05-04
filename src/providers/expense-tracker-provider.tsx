import React, { useMemo } from "react";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import Loader from "@/components/layout/loader";
import $ExpenseTemplate from "@/services/expense-template";
import $ExpenseRecord from "@/services/expense-record";
import useSettingsStore from "@/stores/use-settings-store";
import useSessionStore from "@/stores/use-session-store";
import ArrayTools from "@/tools/array-tools";
import TrackerTools from "@/tools/tracker-tools";
import { ExpenseRecord, ExpenseTemplate } from "@/types/expense";

type ExpenseTrackerContextType = {
  templates: ExpenseTemplate[];
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
  const { selectedTab } = useSettingsStore();

  // Here is where the list of expenses should be calculated
  const sortedTemplates = useMemo(() => {
    if (!data?.templates) {
      return {
        monthly: [],
        annual: [],
        all: [],
      };
    }

    const sorted = Object.groupBy(data.templates, (record) => record.type);

    return {
      monthly: sorted.monthly || [],
      annual: sorted.annual || [],
      all: data.templates,
    };
  }, [data]);

  // Here is where the list of expenses should be filtered
  const templates = useMemo(() => {
    console.log("filtering templates");

    return sortedTemplates[selectedTab];
  }, [sortedTemplates, selectedTab]);

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
