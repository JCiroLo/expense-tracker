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
        minHeight: "100vh",
      }}
    >
      <Outlet />
    </Container>
  );
};

export default App;
