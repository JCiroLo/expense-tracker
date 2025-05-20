import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline } from "@mui/material";
import SessionManager from "@/components/layout/session-manager";
import ExpenseTrackerProvider from "@/providers/expense-tracker-provider";
import ThemeProvider from "@/providers/theme-provider";
import HighlightProvider from "@/providers/highlight-provider";
import DialogProvider from "@/providers/dialog-provider";
import router from "@/lib/router";
import queryClient from "@/lib/query-client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionManager>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <HighlightProvider>
            <DialogProvider>
              <ExpenseTrackerProvider>
                <CssBaseline />
                <RouterProvider router={router} />
              </ExpenseTrackerProvider>
            </DialogProvider>
          </HighlightProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionManager>
  </StrictMode>
);
