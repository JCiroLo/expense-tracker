import { Outlet } from "react-router";
import { Slide } from "@mui/material";
import ExpenseFormDialog from "@/components/dialogs/expense-form-dialog";
import IncomeFormDialog from "@/components/dialogs/income-form-dialog";
import RemoveExpenseDialog from "@/components/dialogs/remove-expense-dialog";
import RemoveIncomeDialog from "@/components/dialogs/remove-income-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import ActionsBar from "@/components/layout/actions-bar";
import DateSelector from "@/components/layout/date-selector";
import Loader from "@/components/layout/loader";
import NavigationTabs from "@/components/layout/navigation-tabs";
import PageContainer from "@/components/layout/page-container";
import Sidebar from "@/components/layout/sidebar";
import useBoolean from "@/hooks/use-boolean";
import useDialog from "@/hooks/use-dialog";
import useExpenses from "@/hooks/use-expenses";
import useIncomes from "@/hooks/use-incomes";

const AppWrapper = () => {
  const dialog = useDialog();
  const showActionsBar = useBoolean({ autoload: true, autoloadDelay: 300 });

  const expenses = useExpenses();
  const incomes = useIncomes();

  return (
    <PageContainer>
      <NavigationTabs />
      <DateSelector />
      <Outlet />
      <Slide in={showActionsBar} direction="up" mountOnEnter>
        <ActionsBar />
      </Slide>
      <Slide in={showActionsBar} direction="right" mountOnEnter>
        <Sidebar />
      </Slide>
      <ExpenseFormDialog
        open={dialog.isOpen("manage-expense-template")}
        template={dialog.getData("manage-expense-template")}
        onClose={() => dialog.close("manage-expense-template")}
      />
      <RemoveExpenseDialog
        open={dialog.isOpen("remove-expense-template")}
        template={dialog.getData("remove-expense-template")}
        onClose={() => dialog.close("remove-expense-template")}
      />
      <IncomeFormDialog
        open={dialog.isOpen("manage-income-template")}
        template={dialog.getData("manage-income-template")}
        onClose={() => dialog.close("manage-income-template")}
      />
      <RemoveIncomeDialog
        open={dialog.isOpen("remove-income-template")}
        template={dialog.getData("remove-income-template")}
        onClose={() => dialog.close("remove-income-template")}
      />
      <SettingsDialog open={dialog.isOpen("global-settings")} onClose={() => dialog.close("global-settings")} />
      <Loader show={expenses.isLoading || incomes.isLoading} />
    </PageContainer>
  );
};

export default AppWrapper;
