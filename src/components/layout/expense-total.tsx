import { useMemo } from "react";
import { Paper, Stack, Typography } from "@mui/material";
import useExpenseTracker from "@/hooks/use-expense-tracker";
import useSettingsStore from "@/stores/use-settings-store";
import CurrencyTools from "@/tools/currency-tools";

const ExpenseTotal = () => {
  const { templates, records } = useExpenseTracker();
  const { selectedTab } = useSettingsStore();

  const totals = useMemo(() => {
    const { monthly, annual, oneTime } = templates[selectedTab].reduce(
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
      { monthly: { expected: 0, paid: 0 }, annual: { expected: 0, paid: 0 }, oneTime: { expected: 0, paid: 0 } }
    );

    records.oneTime.forEach((record) => {
      oneTime.paid += record.amount || 0;
    });

    return {
      monthly,
      annual,
      oneTime,
      all: {
        expected: monthly.expected + annual.expected + oneTime.expected,
        paid: monthly.paid + annual.paid + oneTime.paid,
      },
    };
  }, [templates, selectedTab, records.indexed, records.oneTime]);

  return (
    <Stack
      component={Paper}
      elevation={0}
      direction="row"
      justifyContent="space-between"
      padding={1}
      marginBottom={{ xs: 0, sm: 1 }}
      borderRadius={1}
    >
      <Typography variant="subtitle1">Total previsto: {CurrencyTools.format(totals[selectedTab].expected)}</Typography>
      <Typography variant="subtitle1">Total pagado: {CurrencyTools.format(totals[selectedTab].paid)}</Typography>
    </Stack>
  );
};

export default ExpenseTotal;
