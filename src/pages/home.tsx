import { Paper, Stack, Tab, Tabs } from "@mui/material";
import ExpiredExpenseList from "@/components/layout/expired-expense-list";
import ExpenseList from "@/components/layout/expense-list";
import ExpenseTotal from "@/components/layout/expense-total";
import ActionsBar from "@/components/layout/actions-bar";
import Sidebar from "@/components/layout/sidebar";
import ExpenseFormDialog from "@/components/dialogs/expense-form-dialog";
import SettingsDialog from "@/components/dialogs/settings-dialog";
import useSettingsStore from "@/stores/use-settings-store";
import useDialog from "@/hooks/use-dialog";
import { Tab as TabType } from "@/types/global";

const Home = () => {
  const dialog = useDialog();

  const { selectedTab, setSelectedTab } = useSettingsStore();

  const handleTabChange = (_: React.SyntheticEvent, tab: TabType) => {
    setSelectedTab(tab);
  };

  return (
    <>
      <Stack component={Paper} elevation={0} marginTop={1}>
        <Tabs value={selectedTab} centered onChange={handleTabChange}>
          <Tab label="Mensuales" value="monthly" />
          <Tab label="Anuales" value="annual" />
          <Tab label="Todos" value="all" />
        </Tabs>
      </Stack>

      {selectedTab === "monthly" && <ExpiredExpenseList />}

      <ExpenseList />
      <ExpenseTotal />
      <Sidebar />
      <ActionsBar />

      <ExpenseFormDialog
        open={dialog.isOpen("manage-expense-template")}
        template={dialog.getData("manage-expense-template")}
        onClose={() => dialog.close("manage-expense-template")}
      />
      <SettingsDialog open={dialog.isOpen("global-settings")} onClose={() => dialog.close("global-settings")} />
    </>
  );
};

export default Home;
