import { Box, List, Typography } from "@mui/material";
import FeaturesModal from "@/components/dialogs/features-modal";
import ExpiredExpenseList from "@/components/layout/expired-expense-list";
import ExpenseList from "@/components/layout/expense-list";
import IncomeList from "@/components/layout/income-list";
import useSettingsStore from "@/stores/use-settings-store";
import useExpenses from "@/hooks/use-expenses";
import useIncomes from "@/hooks/use-incomes";

const Home = () => {
  const { selectedTab } = useSettingsStore();

  const expenses = useExpenses();
  const incomes = useIncomes();

  const isFetching = expenses.isLoading || incomes.isLoading;
  const hasExpenses = Boolean(expenses.templates.all.length);
  const hasIncomes = Boolean(incomes.templates.all.length);

  return (
    <>
      {selectedTab === "monthly" && <ExpiredExpenseList />}
      {isFetching ? (
        <Box height="100%" />
      ) : (
        <List sx={{ height: "100%", overflowY: "auto" }} disablePadding>
          {!hasExpenses && !hasIncomes ? (
            <Typography component="li" variant="body2" color="text.secondary" textAlign="center" sx={{ my: 2 }}>
              No hay ingresos ni gastos registrados aún.
            </Typography>
          ) : null}
          <ExpenseList />
          <IncomeList />
        </List>
      )}
      <FeaturesModal />
    </>
  );
};

export default Home;
