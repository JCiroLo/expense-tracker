import React from "react";
import { ExpenseTrackerContext } from "@/providers/expense-tracker-provider";

const useExpenseTracker = () => {
  return React.useContext(ExpenseTrackerContext);
};

export default useExpenseTracker;
