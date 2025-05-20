import { Fab, Paper, Stack, Tab, Tooltip } from "@mui/material";
import PlusIcon from "@/components/icons/plus-icon";
import CogIcon from "@/components/icons/cog-icon";
import useDialog from "@/hooks/use-dialog";

const ActionsBar = () => {
  const dialog = useDialog();

  return (
    <>
      <Stack position="fixed" bottom={16} right={16} display={{ xs: "none", sm: "flex" }} alignItems="center" spacing={1}>
        <Tooltip title="Ajustes" placement="left">
          <Fab aria-label="Settings" size="small" color="primary" onClick={() => dialog.open("global-settings")}>
            <CogIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Agregar pago" placement="left">
          <Fab aria-label="Add" color="primary" onClick={() => dialog.open("manage-expense-template")}>
            <PlusIcon />
          </Fab>
        </Tooltip>
      </Stack>

      <Stack
        component={Paper}
        elevation={0}
        display={{ xs: "flex", sm: "none" }}
        direction="row"
        alignItems="center"
        justifyContent="space-evenly"
        marginBottom={1}
      >
        <span style={{ width: 90 }}></span>
        <Fab aria-label="Add" size="medium" color="primary" onClick={() => dialog.open("manage-expense-template")}>
          <PlusIcon />
        </Fab>
        <Tab icon={<CogIcon />} onClick={() => dialog.open("global-settings")} />
      </Stack>
    </>
  );
};

export default ActionsBar;
