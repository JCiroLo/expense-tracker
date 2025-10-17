import { Box, List, Typography } from "@mui/material";
import FeaturesModal from "@/components/dialogs/features-modal";
import ExpirationAlerts from "@/components/layout/expiration-alerts";
import ExpenseList from "@/components/layout/expense-list";
import IncomeList from "@/components/layout/income-list";
import useSettingsStore from "@/stores/use-settings-store";
import useExpenses from "@/hooks/use-expenses";
import useFilters from "@/hooks/use-filters";
import useIncomes from "@/hooks/use-incomes";
import DateTools from "@/tools/date-tools";

const Home = () => {
  const { selectedTab } = useSettingsStore();

  const expenses = useExpenses();
  const { filters } = useFilters();
  const incomes = useIncomes();

  const isFetching = expenses.isLoading || incomes.isLoading;
  const hasExpenses = Boolean(expenses.templates[selectedTab].length);
  const hasIncomes = Boolean(incomes.templates[selectedTab].length);
  const displayExpirationList = selectedTab === "monthly" && filters.month === DateTools.month;

  return (
    <>
      {displayExpirationList && <ExpirationAlerts />}
      {isFetching ? (
        <Box height="100%" />
      ) : (
        <List sx={{ height: "100%", overflowY: "auto" }} disablePadding>
          {!hasExpenses && !hasIncomes ? (
            <Typography
              component="li"
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
            >
              No tienes gastos ni ingresos registrados aún.
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
