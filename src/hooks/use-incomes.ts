import React from "react";
import { IncomeContext } from "@/providers/income-provider";

const useIncomes = () => {
  return React.useContext(IncomeContext);
};

export default useIncomes;
