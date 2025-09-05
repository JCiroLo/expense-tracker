import ListSelector from "@/components/ui/list-selector";
import useExpenseTracker from "@/hooks/use-expense-tracker";
import useSettingsStore from "@/stores/use-settings-store";
import DateTools from "@/tools/date-tools";

const DateSelector = () => {
  const { selectedTab } = useSettingsStore();

  const { filters, updateFilters } = useExpenseTracker();

  function handleMonthChange(newMonth: string | number) {
    updateFilters({ month: Number(newMonth) });
  }

  function handleYearChange(newYear: string | number) {
    updateFilters({ year: Number(newYear) });
  }

  return selectedTab === "monthly" ? (
    <ListSelector value={filters.month} options={DateTools.months} highlightValue={DateTools.month} onChange={handleMonthChange} />
  ) : (
    <ListSelector value={filters.year} options={DateTools.years} highlightValue={DateTools.year} onChange={handleYearChange} />
  );
};

export default DateSelector;
