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
        gap: 1,
        flexDirection: "column",
        justifyContent: "center",
        height: "100dvh",
        paddingX: 1,
      }}
    >
      <Outlet />
    </Container>
  );
};

export default App;
