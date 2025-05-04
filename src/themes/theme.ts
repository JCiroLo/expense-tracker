import { createTheme } from "@mui/material";

const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        mode: "dark",
        primary: {
          main: "rgb(245, 182, 6)",
        },
        background: {
          paper: "#343434bf",
        },
      },
    },
    light: {
      palette: {
        mode: "light",
        primary: {
          main: "rgb(245, 182, 6)",
        },
        background: {
          paper: "#eeeeeed4",
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "'Lato', sans-serif",
    button: {
      textTransform: "initial",
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        "::-webkit-scrollbar-track": {
          borderRadius: 16,
          background: theme.palette.mode === "dark" ? "#1E1E1E" : "#f6f6f6",
        },
        "::-webkit-scrollbar-thumb": {
          borderRadius: 16,
          background: theme.palette.mode === "dark" ? "#454545" : "#d8d8d8",
        },
        "::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },
        "@keyframes scale_LDJPO": {
          "0%, 20%, 80%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.5)",
          },
        },
        "@keyframes fade_LDJPO": {
          "0%, 20%, 80%, 100%": {
            opacity: "0.8",
          },
          "50%": {
            opacity: 1,
          },
        },
      }),
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        disableElevation: true,
      },
    },
    MuiDialog: {
      defaultProps: {
        slotProps: {
          paper: {
            elevation: 0,
            sx: {
              borderRadius: 2,
            },
          },
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(4px) saturate(150%)",
            },
          },
        },
      },
    },
    MuiDialogActions: {
      defaultProps: {
        sx: {
          padding: 2,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(16px) saturate(200%)",
        },
      },
    },
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
  },
});

export default theme;
