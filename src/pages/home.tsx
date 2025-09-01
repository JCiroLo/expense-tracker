import ExpiredExpenseList from "@/components/layout/expired-expense-list";
import ExpenseList from "@/components/layout/expense-list";
import useSettingsStore from "@/stores/use-settings-store";

const Home = () => {
  const { selectedTab } = useSettingsStore();

  return (
    <>
      {selectedTab === "monthly" && <ExpiredExpenseList />}
      <ExpenseList />
    </>
  );
};

export default Home;
