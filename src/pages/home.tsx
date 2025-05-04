import { useState } from "react";
import { Fab, Paper, Stack, Tab, Tabs, Zoom } from "@mui/material";
import ExpenseList from "@/components/layout/expense-list";
import ExpenseTotal from "@/components/layout/expense-total";
import Sidebar from "@/components/layout/sidebar";
import ExpenseFormDialog from "@/components/dialogs/expense-form-dialog";
import PlusIcon from "@/components/icons/plus-icon";
import useSettingsStore from "@/stores/use-settings-store";
import { Tab as TabType } from "@/types/global";

const Home = () => {
  const { selectedTab, setSelectedTab } = useSettingsStore();
  const [showExpenseForm, setShowExpenseForm] = useState(false);

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
      <Stack flexGrow={1} sx={{ height: "calc(100vh - 48px - 104px)", my: 2, overflow: "auto" }}>
        <ExpenseList />
      </Stack>

      <ExpenseTotal />

      <Sidebar />

      <Zoom in>
        <Fab
          sx={{ boxShadow: 0, position: "fixed", bottom: 16, right: 16 }}
          aria-label="Add"
          color="primary"
          onClick={() => setShowExpenseForm(true)}
        >
          <PlusIcon />
        </Fab>
      </Zoom>

      <ExpenseFormDialog open={showExpenseForm} onClose={() => setShowExpenseForm(false)} />
    </>
  );
};

export default Home;
