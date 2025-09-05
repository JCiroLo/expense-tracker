import React from "react";
import { useTheme } from "@mui/material";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses, lineElementClasses } from "@mui/x-charts/LineChart";
import { chartsAxisHighlightClasses } from "@mui/x-charts/ChartsAxisHighlight";
import useExpenseTracker from "@/hooks/use-expense-tracker";
import useSettingsStore from "@/stores/use-settings-store";
import DateTools from "@/tools/date-tools";

const FinancialStressChart: React.FC = () => {
  const theme = useTheme();
  const { templates } = useExpenseTracker();
  const { selectedTab } = useSettingsStore();

  const chart = React.useMemo(() => {
    let data: number[] = [];
    let xAxis: string[] = [];

    if (selectedTab === "monthly") {
      data = Array.from({ length: DateTools.daysInMonth }, () => 0);

      xAxis = data.map((_, index) => String(index + 1));

      templates[selectedTab].map((template) => {
        data[(template.due_day || 0) - 1] += template.amount;
      });
    } else if (selectedTab === "annual") {
      data = Array.from({ length: 12 }, () => 0);

      xAxis = DateTools.months.map((month) => month.name);

      templates[selectedTab].map((template) => {
        data[(template.due_month || 0) - 1] += template.amount;
      });
    }

    return { data, xAxis };
  }, [templates, selectedTab]);

  return (
    <SparkLineChart
      data={chart.data}
      yAxis={{
        domainLimit: (_, maxValue: number) => ({
          min: -maxValue / 6,
          max: maxValue,
        }),
      }}
      xAxis={{
        scaleType: "point",
        data: chart.xAxis,
        valueFormatter: (value: string) => (selectedTab === "monthly" ? `Día ${value}` : value),
      }}
      baseline="min"
      margin={{ bottom: 0, top: 8, left: 0, right: 0 }}
      clipAreaOffset={{ top: 2, bottom: 2 }}
      axisHighlight={{ x: "line" }}
      color={theme.palette.primary.main}
      slotProps={{
        lineHighlight: { r: 4 },
      }}
      sx={(theme) => ({
        [`& .${areaElementClasses.root}`]: { opacity: 0.1, fill: theme.palette.primary.main },
        [`& .${lineElementClasses.root}`]: { strokeWidth: 3, stroke: theme.palette.primary.main },
        [`& .${chartsAxisHighlightClasses.root}`]: {
          stroke: theme.palette.primary.main,
          strokeDasharray: "none",
          strokeWidth: 2,
        },
      })}
      area
      showTooltip
      showHighlight
    />
  );
};

export default FinancialStressChart;
