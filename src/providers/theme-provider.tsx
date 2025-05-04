import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import theme from "@/themes/theme";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme = "system", storageKey = "ui-theme" }) => {
  return (
    <MuiThemeProvider modeStorageKey={storageKey} defaultMode={defaultTheme} theme={theme} noSsr>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
