import { useMemo } from "react";
import { Paper, Stack, Typography } from "@mui/material";
import { Gauge } from "@mui/x-charts";
import DistributionChart from "@/components/charts/distribution-chart";
import FinancialStressChart from "@/components/charts/financial-stress-chart";
import useExpenseTracker from "@/hooks/use-expense-tracker";
import useSettingsStore from "@/stores/use-settings-store";
import CurrencyTools from "@/tools/currency-tools";

const Analytics = () => {
  const { templates, records } = useExpenseTracker();
  const { selectedTab } = useSettingsStore();

  const totals = useMemo(() => {
    const values = templates[selectedTab].reduce(
      (acc, template) => {
        const record = records.indexed[template.id] || null;
        const isPaid = Boolean(record);
        const amount = template.amount;

        if (template.type === "monthly") {
          acc.monthly.expected += amount;

          if (isPaid) acc.monthly.paid += amount;
        } else {
          acc.annual.expected += amount;

          if (isPaid) acc.annual.paid += amount;
        }

        return acc;
      },
      {
        monthly: { expected: 0, paid: 0 },
        annual: { expected: 0, paid: 0 },
        oneTime: { expected: 0, paid: 0 },
      }
    );

    const allValues = {
      expected: values.monthly.expected + values.annual.expected + values.oneTime.expected,
      paid: values.monthly.paid + values.annual.paid + values.oneTime.paid,
    };

    records.oneTime.forEach((record) => {
      values.oneTime.paid += record.amount || 0;
    });

    const percentages = {
      monthly: values.monthly.expected === 0 ? 100 : (values.monthly.paid / values.monthly.expected) * 100,
      annual: values.annual.expected === 0 ? 100 : (values.annual.paid / values.annual.expected) * 100,
      oneTime: values.oneTime.expected === 0 ? 100 : (values.oneTime.paid / values.oneTime.expected) * 100,
      all: allValues.expected === 0 ? 100 : (allValues.paid / allValues.expected) * 100,
    };

    return {
      percentages,
      monthly: values.monthly,
      annual: values.annual,
      oneTime: values.oneTime,
      all: allValues,
    };
  }, [templates, selectedTab, records.indexed, records.oneTime]);

  return (
    <Stack height="100%" gap={2} sx={{ overflowY: "auto" }}>
      <Stack direction="row" gap={2}>
        <Stack flexShrink={0} justifyContent="center" width="33%" padding={1} borderRadius={1}>
          <Typography component="h5" variant="body2" color="textSecondary" textAlign="center">
            Avance
          </Typography>
          <Typography textAlign="center" fontSize="1.5rem">
            {CurrencyTools.format(totals[selectedTab].paid)}
          </Typography>
        </Stack>
        <Gauge
          value={totals.percentages[selectedTab]}
          startAngle={-140}
          endAngle={140}
          cornerRadius="50%"
          text={({ value }) => `${value?.toFixed() || 0}%`}
          sx={{
            "& .MuiGauge-valueText": {
              fontSize: "2rem",
            },
          }}
        />
        <Stack flexShrink={0} justifyContent="center" width="33%" padding={1} borderRadius={1}>
          <Typography component="h5" variant="body2" color="textSecondary" textAlign="center">
            Meta
          </Typography>
          <Typography textAlign="center" fontSize="1.5rem">
            {CurrencyTools.format(totals[selectedTab].expected)}
          </Typography>
        </Stack>
      </Stack>
      <Stack component={Paper} elevation={0} flexShrink={0} gap={1} borderRadius={1} overflow="hidden" height={200}>
        <Typography variant="subtitle1" paddingX={2} paddingY={1}>
          Estrés financiero
        </Typography>
        <FinancialStressChart />
      </Stack>
      <Stack component={Paper} elevation={0} flexShrink={0} gap={1} borderRadius={1} overflow="hidden" height={200}>
        <Typography variant="subtitle1" paddingX={2} paddingY={1}>
          Distribución
        </Typography>
        <DistributionChart />
      </Stack>
    </Stack>
  );
};

export default Analytics;
