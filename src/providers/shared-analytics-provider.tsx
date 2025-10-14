import React from "react";
import useExpenses from "@/hooks/use-expenses";
import useIncomes from "@/hooks/use-incomes";
import useSettingsStore from "@/stores/use-settings-store";
import ArrayTools from "@/tools/array-tools";
import DateTools from "@/tools/date-tools";

type SharedAnalyticsContextType = {
  balance: {
    data: {
      expenses: number[];
      incomes: number[];
    };
    xAxis: string[];
  };
  cumulativeBalance: {
    xAxis: string[];
    data: number[];
  };
};

type SharedAnalyticsProviderProps = {
  children: React.ReactNode;
};

const SharedAnalyticsContext = React.createContext<SharedAnalyticsContextType>(null!);

const SharedAnalyticsProvider: React.FC<SharedAnalyticsProviderProps> = ({ children }) => {
  const { selectedTab } = useSettingsStore();

  const expenses = useExpenses();
  const incomes = useIncomes();

  const balanceDistribution = React.useMemo(() => {
    let data: { expenses: number[]; incomes: number[] } = { expenses: [], incomes: [] };
    let xAxis: string[] = [];

    if (selectedTab === "monthly") {
      const days = Array.from({ length: DateTools.daysInMonth }, () => 0);

      data = { expenses: Array.from(days), incomes: Array.from(days) };

      xAxis = days.map((_, index) => String(index + 1));

      [...expenses.templates.monthly, ...expenses.templates.oneTime].map((template) => {
        data.expenses[(template.due_day || 0) - 1] += template.amount;
      });

      [...incomes.templates.monthly, ...incomes.templates.oneTime].map((template) => {
        data.incomes[(template.due_day || 0) - 1] += template.amount;
      });
    } else if (selectedTab === "annual") {
      const months = Array.from({ length: 12 }, () => 0);

      data = { expenses: Array.from(months), incomes: Array.from(months) };

      xAxis = DateTools.months.map((month) => month.name);

      expenses.templates.annual.map((template) => {
        data.expenses[(template.due_month || 0) - 1] += template.amount;
      });

      incomes.templates.annual.map((template) => {
        data.incomes[(template.due_month || 0) - 1] += template.amount;
      });
    }

    return { data, xAxis };
  }, [expenses.templates, incomes.templates, selectedTab]);

  const cumulativeBalance = React.useMemo(() => {
    const xAxis = balanceDistribution.xAxis;

    return {
      xAxis,
      data: ArrayTools.cumulativeSum(
        xAxis.map((_, index) => -balanceDistribution.data.expenses[index] + balanceDistribution.data.incomes[index]),
        (item) => item
      ),
    };
  }, [balanceDistribution]);

  return (
    <SharedAnalyticsContext.Provider value={{ cumulativeBalance, balance: balanceDistribution }}>
      {children}
    </SharedAnalyticsContext.Provider>
  );
};

export { SharedAnalyticsContext };
export default SharedAnalyticsProvider;
