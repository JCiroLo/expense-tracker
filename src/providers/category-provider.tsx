import React from "react";
import { type QueryObserverResult, type RefetchOptions, useQuery } from "@tanstack/react-query";
import $ExpenseCategory from "@/services/expense-category";
import useSessionStore from "@/stores/use-session-store";
import Logger from "@/lib/logger";
import type { ExpenseCategory } from "@/types/expense";

type CategoryContextType = {
  categories: ExpenseCategory[];
  isLoading: boolean;
  query: ReturnType<typeof useQuery>;
  refresh: (options?: RefetchOptions) => Promise<QueryObserverResult>;
};

type CategoryProviderProps = {
  children: React.ReactNode;
};

const CategoryContext = React.createContext<CategoryContextType>(null!);

const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const user = useSessionStore((state) => state.user);

  const categories = useQuery({
    queryKey: ["fetch-categories", user?.uid],
    queryFn: async () => {
      if (!user) {
        return [];
      }

      const { error, data } = await $ExpenseCategory.getAll({ userId: user.uid });

      if (error) {
        throw error;
      }

      Logger.log("fetched categories", data);

      return data;
    },
  });

  return (
    <CategoryContext.Provider
      value={{
        categories: categories.data || [],
        isLoading: categories.isLoading,
        query: categories,
        refresh: categories.refetch,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export { CategoryContext };
export default CategoryProvider;
