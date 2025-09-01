import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import useExpenseTracker from "@/hooks/use-expense-tracker";
import $ExpenseTemplate from "@/services/expense-template";
import type { ExpenseTemplate } from "@/types/expense";

type RemoveExpenseDialogProps = {
  open: boolean;
  onClose: () => void;
  template?: ExpenseTemplate;
};

const RemoveExpenseDialog: React.FC<RemoveExpenseDialogProps> = ({ open, template, onClose }) => {
  const { refresh } = useExpenseTracker();

  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!template) {
      // TODO: show error message
      return;
    }

    setIsLoading(true);

    await $ExpenseTemplate.delete(template.id);

    await refresh();

    setIsLoading(false);

    onClose();
  }

  return (
    <Dialog maxWidth="sm" open={open} fullWidth onClose={onClose}>
      <DialogTitle>Eliminar gasto</DialogTitle>
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

export default RemoveExpenseDialog;
