import React, { useMemo } from "react";
import { Paper, Stack, Typography } from "@mui/material";
import { TabType } from "@/app";
import useExpenseStore from "@/stores/use-expense-store";
import DateTools from "@/lib/date-tools";

type ExpenseTotalProps = {
  type: TabType;
};

const ExpenseTotal: React.FC<ExpenseTotalProps> = ({ type }) => {
  const { templates, records, getTotalByDate } = useExpenseStore();

  const total = useMemo(() => {
    const { monthly, annual } = getTotalByDate(DateTools.now);

    return {
      monthly,
      annual,
      all: {
        expected: monthly.expected + annual.expected,
        paid: monthly.paid + annual.paid,
      },
    };
  }, [templates, records]);

  return (
    <Stack
      component={Paper}
      direction="row"
      justifyContent="space-between"
      padding={1}
      borderRadius={1}
    >
      <Typography variant="subtitle1">
        Total previsto: ${total[type].expected}
      </Typography>
      <Typography variant="subtitle1">
        Total pagado: ${total[type].paid}
      </Typography>
    </Stack>
  );
};

export default ExpenseTotal;
