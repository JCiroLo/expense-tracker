import React from "react";
import DateTools from "@/tools/date-tools";

type Filters = {
  month: number;
  year: number;
};

type FiltersContextType = {
  filters: Filters;
  updateFilters: (newFilters: Partial<Filters>) => void;
};

type FiltersProviderProps = {
  children: React.ReactNode;
};

const FiltersContext = React.createContext<FiltersContextType>(null!);

const FiltersProvider: React.FC<FiltersProviderProps> = ({ children }) => {
  const [filters, setFilters] = React.useState<Filters>({
    month: DateTools.month,
    year: DateTools.year,
  });

  function updateFilters(newFilters: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }

  return (
    <FiltersContext.Provider
      value={{
        filters,
        updateFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export { FiltersContext };
export default FiltersProvider;
