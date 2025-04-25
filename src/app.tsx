import { useMemo, useState } from "react";
import { AppBar, Container, Fab, Stack, Tab, Tabs, Zoom } from "@mui/material";
import useExpenseStore from "@/stores/use-expense-store";
import ExpenseList from "@/components/layout/expense-list";
import ExpenseTotal from "@/components/layout/expense-total";
import ExpenseFormDialog from "@/components/dialogs/expense-form-dialog";
import PlusIcon from "@/components/icons/plus-icon";

export type TabType = "monthly" | "annual" | "all";

function App() {
  const { templates, getTemplates } = useExpenseStore();

  const [selectedTab, setSelectedTab] = useState<TabType>("monthly");
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const myExpenses = useMemo(() => {
    return getTemplates();
  }, [templates]);

  const handleTabChange = (_: React.SyntheticEvent, tab: TabType) => {
    setSelectedTab(tab);
  };

  return (
    <Container maxWidth="sm" sx={{ position: "relative" }}>
      <AppBar position="static" sx={{ width: "100%", mt: 2, borderRadius: 1 }}>
        <Tabs value={selectedTab} centered onChange={handleTabChange}>
          <Tab label="Mensuales" value="monthly" />
          <Tab label="Anuales" value="annual" />
          <Tab label="Todos" value="all" />
        </Tabs>
      </AppBar>
      <Stack
        flexGrow={1}
        sx={{ height: "calc(100vh - 48px - 104px)", my: 2, overflow: "auto" }}
      >
        <ExpenseList expenses={myExpenses[selectedTab]} />
      </Stack>

      <ExpenseTotal type={selectedTab} />

      <Zoom in>
        <Fab
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          aria-label="Add"
          color="primary"
          onClick={() => setShowExpenseForm(true)}
        >
          <PlusIcon />
        </Fab>
      </Zoom>
      <ExpenseFormDialog
        open={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
      />
    </Container>
  );
}

export default App;
