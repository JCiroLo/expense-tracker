import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline } from "@mui/material";
import EnvChip from "@/components/layout/env-chip";
import SessionManager from "@/components/layout/session-manager";
import CategoryProvider from "@/providers/category-provider";
import DialogProvider from "@/providers/dialog-provider";
import ExpenseProvider from "@/providers/expense-provider";
import FiltersProvider from "@/providers/filters-provider";
import HighlightProvider from "@/providers/highlight-provider";
import IncomeProvider from "@/providers/income-provider";
import ThemeProvider from "@/providers/theme-provider";
import { initDayjs } from "@/lib/dayjs";
import router from "@/lib/router";
import queryClient from "@/lib/query-client";

initDayjs();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EnvChip />
    <ThemeProvider defaultTheme="dark">
      <CssBaseline />
      <SessionManager>
        <QueryClientProvider client={queryClient}>
          <HighlightProvider>
            <FiltersProvider>
              <DialogProvider>
                <CategoryProvider>
                  <ExpenseProvider>
                    <IncomeProvider>
                      <RouterProvider router={router} />
                    </IncomeProvider>
                  </ExpenseProvider>
                </CategoryProvider>
              </DialogProvider>
            </FiltersProvider>
          </HighlightProvider>
        </QueryClientProvider>
      </SessionManager>
    </ThemeProvider>
  </StrictMode>
);
