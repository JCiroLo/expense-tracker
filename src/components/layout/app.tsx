import { Outlet } from "react-router";
import { Container } from "@mui/material";

const App = () => {
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
        paddingX: 1,
      }}
    >
      <Outlet />
    </Container>
  );
};

export default App;
