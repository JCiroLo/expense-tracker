import React, { useMemo } from "react";
import { useTheme } from "@mui/material";
import { legendClasses } from "@mui/x-charts";
import { PieChart } from "@mui/x-charts/PieChart";
import useCategories from "@/hooks/use-categories";
import useExpenses from "@/hooks/use-expenses";
import useSettingsStore from "@/stores/use-settings-store";
import ColorTools from "@/tools/color-tools";

const ExpenseDistributionChart = () => {
  const { selectedTab } = useSettingsStore();

  const theme = useTheme();
  const categories = useCategories();
  const expenses = useExpenses();

  const data = React.useMemo(() => {
    const chartData = categories.values.map((category) => ({ label: category.name, id: category.id, value: 0 }));
    const noCategoryItem = { label: "Sin categoría", id: "no-category", value: 0, color: theme.palette.action.disabled };

    chartData.push(noCategoryItem);

    expenses.templates[selectedTab].forEach((template) => {
      const category = chartData.find((cat) => cat.id === template.category_id);

      if (category) {
        category.value += template.amount;
      } else {
        noCategoryItem.value += template.amount;
      }
    });

    return chartData;
  }, [selectedTab, categories, expenses.templates]);

  const palette = useMemo(() => ColorTools.palette(theme.palette.primary.main, data.length), [data.length, theme.palette.primary.main]);

  return (
    <PieChart
      height={120}
      width={120}
      colors={palette}
      series={[
        {
          data,
          innerRadius: 24,
          paddingAngle: 2,
          cornerRadius: 4,
        },
      ]}
      sx={{
        [`& .${legendClasses.root}`]: {
          gap: 1,
        },
      }}
    />
  );
};

export default ExpenseDistributionChart;
