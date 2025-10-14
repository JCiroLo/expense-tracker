import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import useIncomes from "@/hooks/use-incomes";
import $IncomeTemplate from "@/services/income-template";
import type { IncomeTemplate } from "@/types/income";

type RemoveIncomeDialogProps = {
  open: boolean;
  onClose: () => void;
  template?: IncomeTemplate;
};

const RemoveIncomeDialog: React.FC<RemoveIncomeDialogProps> = ({ open, template, onClose }) => {
  const { refresh } = useIncomes();

  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!template) {
      // TODO: show error message
      return;
    }

    setIsLoading(true);

    await $IncomeTemplate.delete(template.id);

    await refresh.templates();
    await refresh.records();

    setIsLoading(false);

    onClose();
  }

  return (
    <Dialog maxWidth="sm" open={open} fullWidth onClose={onClose}>
      <DialogTitle>Eliminar ingreso</DialogTitle>
      <DialogContent>
        <Stack id="remove-expense-form" component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Typography>¿Estás seguro de que deseas eliminarlo? </Typography>
          <Typography variant="body2" color="text.secondary">
            También se eliminarán los pagos asociados. Esta acción no se puede deshacer.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" fullWidth onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" type="submit" form="remove-expense-form" loading={isLoading} fullWidth>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveIncomeDialog;
