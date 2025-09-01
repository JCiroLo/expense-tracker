import { NavLink } from "react-router-dom";
import { Avatar, Fab, Paper, Stack, Tab } from "@mui/material";
import ChartPieIcon from "@/components/icons/chart-pie";
import ChartPieFilledIcon from "@/components/icons/chart-pie-filled-icon";
import CogIcon from "@/components/icons/cog-icon";
import HomeIcon from "@/components/icons/home-icon";
import HomeFilledIcon from "@/components/icons/home-filled-icon";
import PlusIcon from "@/components/icons/plus-icon";
import useDialog from "@/hooks/use-dialog";
import { forwardRef } from "react";

const ActionsBar = forwardRef<HTMLDivElement>((_, ref) => {
  const dialog = useDialog();

  return (
    <Stack ref={ref} component={Paper} elevation={0} direction="row" alignItems="center" justifyContent="space-evenly" marginBottom={1}>
      <NavLink to="/analytics" style={{ textDecoration: "none", color: "inherit" }}>
        {({ isActive }) => <Tab component="span" icon={isActive ? <ChartPieFilledIcon color="primary" /> : <ChartPieIcon />} />}
      </NavLink>
      <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
        {({ isActive }) => <Tab component="span" icon={isActive ? <HomeFilledIcon color="primary" /> : <HomeIcon />} />}
      </NavLink>
      <Fab aria-label="Add" size="medium" color="primary" onClick={() => dialog.open("manage-expense-template")}>
        <PlusIcon />
      </Fab>
      <Tab icon={<CogIcon />} onClick={() => dialog.open("global-settings")} />
      <Tab icon={<Avatar sx={{ width: 24, height: 24 }}></Avatar>} disabled />
    </Stack>
  );
});

ActionsBar.displayName = "ActionsBar";

export default ActionsBar;
