import { createTheme } from "@mui/material";

const dark = createTheme({
  palette: {
    mode: "dark",
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
    MuiButton: {
      defaultProps: {
        variant: "contained",
        disableElevation: true,
      },
    },
    MuiDialog: {
      defaultProps: {
        PaperProps: {
          sx: {
            borderRadius: 2,
          },
        },
        slotProps: {
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(4px)",
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

export default dark;
