import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "@/app.tsx";
import dark from "@/themes/dark";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={dark}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
