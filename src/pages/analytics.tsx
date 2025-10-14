import { Paper, Stack, Typography } from "@mui/material";
import CumulativeBalanceChart, { CumulativeBalanceChartLegend } from "@/components/charts/cumulative-balance-chart";
import ExpenseDistributionChart from "@/components/charts/expense-distribution-chart";
import FinancialStressChart, { FinancialStressChartLegend } from "@/components/charts/financial-stress-chart";
import IncomeDistributionChart from "@/components/charts/income-distribution-chart";
import ProgressChart from "@/components/charts/progress-chart";

const Analytics = () => {
  return (
    <Stack height="100%" gap={{ xs: 1, sm: 2 }} mb={{ xs: 0, sm: 1 }} sx={{ overflowY: "auto" }}>
      <ProgressChart />
      <Stack component={Paper} elevation={0} flexShrink={0} gap={1} borderRadius={1} overflow="hidden" height={200}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" paddingX={2} paddingY={1}>
          <Typography variant="subtitle1">Estrés financiero</Typography>
          <FinancialStressChartLegend />
        </Stack>
        <FinancialStressChart />
      </Stack>
      <Stack component={Paper} elevation={0} flexShrink={0} gap={1} borderRadius={1} overflow="hidden" height={200}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" paddingX={2} paddingY={1}>
          <Typography variant="subtitle1">Balance</Typography>
          <CumulativeBalanceChartLegend />
        </Stack>
        <CumulativeBalanceChart />
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 2 }}>
        <Stack component={Paper} elevation={0} gap={1} borderRadius={1} overflow="hidden" width={{ xs: "100%", sm: "50%" }} height={200}>
          <Typography variant="subtitle1" paddingX={2} paddingY={1}>
            Distribución de gastos
          </Typography>
          <ExpenseDistributionChart />
        </Stack>
        <Stack component={Paper} elevation={0} gap={1} borderRadius={1} overflow="hidden" width={{ xs: "100%", sm: "50%" }} height={200}>
          <Typography variant="subtitle1" paddingX={2} paddingY={1}>
            Distribución de ingresos
          </Typography>
          <IncomeDistributionChart />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Analytics;
