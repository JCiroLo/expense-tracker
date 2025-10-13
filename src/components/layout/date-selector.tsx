import ListSelector from "@/components/ui/list-selector";
import DateTools from "@/tools/date-tools";
import useFilters from "@/hooks/use-filters";
import useSettingsStore from "@/stores/use-settings-store";

const DateSelector = () => {
  const { selectedTab } = useSettingsStore();

  const { filters, updateFilters } = useFilters();

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
