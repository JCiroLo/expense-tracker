import React, { useMemo } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import useExpenses from "@/hooks/use-expenses";
import { useTheme } from "@mui/material";
import ColorTools from "@/tools/color-tools";

const DistributionChart = () => {
  const theme = useTheme();
  const { templates } = useExpenses();

  const data = React.useMemo(
    () => [
      { label: "Mensuales", value: templates.monthly.length },
      { label: "Anuales", value: templates.annual.length },
    ],
    [templates]
  );

  const palette = useMemo(() => ColorTools.palette(theme.palette.primary.main, data.length), [data.length, theme.palette.primary.main]);

  return (
    <PieChart
      width={200}
      colors={palette}
      series={[
        {
          data: data,
          innerRadius: 30,
          paddingAngle: 4,
          cornerRadius: 8,
        },
      ]}
    />
  );
};

export default DistributionChart;
