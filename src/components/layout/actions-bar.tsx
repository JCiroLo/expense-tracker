import { forwardRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Avatar, Fab, Menu, MenuItem, Paper, Stack, Tab } from "@mui/material";
import ChartPieIcon from "@/components/icons/chart-pie";
import ChartPieFilledIcon from "@/components/icons/chart-pie-filled-icon";
import CogIcon from "@/components/icons/cog-icon";
import HomeIcon from "@/components/icons/home-icon";
import HomeFilledIcon from "@/components/icons/home-filled-icon";
import PlusIcon from "@/components/icons/plus-icon";
import useDialog from "@/hooks/use-dialog";

const ActionsBar = forwardRef<HTMLDivElement>((_, ref) => {
  const dialog = useDialog();

  const [menuAnchor, setMenuAnchor] = useState({
    element: null as HTMLElement | null,
  });

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setMenuAnchor({ element: event.currentTarget });
  }

  function handleMenuClose() {
    setMenuAnchor({ element: null });
  }

  return (
    <>
      <Stack ref={ref} component={Paper} elevation={0} direction="row" alignItems="center" justifyContent="space-evenly" marginBottom={1}>
        <NavLink to="/analytics" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => <Tab component="span" icon={isActive ? <ChartPieFilledIcon color="primary" /> : <ChartPieIcon />} />}
        </NavLink>
        <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
          {({ isActive }) => <Tab component="span" icon={isActive ? <HomeFilledIcon color="primary" /> : <HomeIcon />} />}
        </NavLink>
        <Fab aria-label="Add" size="medium" color="primary" onClick={handleMenuOpen}>
          <PlusIcon />
        </Fab>
        <Tab icon={<CogIcon />} onClick={() => dialog.open("global-settings")} />
        <Tab icon={<Avatar sx={{ width: 24, height: 24 }}></Avatar>} disabled />
      </Stack>
      <Menu
        open={Boolean(menuAnchor.element)}
        anchorEl={menuAnchor.element}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        transformOrigin={{ horizontal: "center", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: {
              mt: -1,
            },
          },
        }}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            dialog.open("manage-expense-template");
            handleMenuClose();
          }}
        >
          Agregar gasto
        </MenuItem>
        <MenuItem
          onClick={() => {
            dialog.open("manage-income-template");
            handleMenuClose();
          }}
        >
          Agregar ingreso
        </MenuItem>
      </Menu>
    </>
  );
});

ActionsBar.displayName = "ActionsBar";

export default ActionsBar;
