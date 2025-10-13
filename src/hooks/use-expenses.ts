import React from "react";
import { ExpenseContext } from "@/providers/expense-provider";

const useExpenses = () => {
  return React.useContext(ExpenseContext);
};

export default useExpenses;
