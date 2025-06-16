import React from "react";
import { TextField, Button, MenuItem, Stack, Dialog, DialogContent, DialogActions, InputAdornment } from "@mui/material";
import { NumericFormat } from "react-number-format";
import $ExpenseTemplate from "@/services/expense-template";
import useSessionStore from "@/stores/use-session-store";
import useExpenseTracker from "@/hooks/use-expense-tracker";
import { ExpenseType } from "@/types/expense";
import { ExpenseTemplate } from "@/types/expense";

type ExpenseFormDialogProps = {
  open: boolean;
  onClose: () => void;
  template?: ExpenseTemplate;
};

const ExpenseFormDialog: React.FC<ExpenseFormDialogProps> = ({ open, onClose, template }) => {
  const user = useSessionStore((state) => state.user);
  const { refresh } = useExpenseTracker();

  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const dueDay = Number(formData.get("dueDay"));
    const type = formData.get("type") as ExpenseType | "none";
    const rawAmount = formData.get("amount") as string;
    const amount = Number(rawAmount.replaceAll(",", ""));

    if (Number.isNaN(amount)) {
      return;
    }

    if (!title || !amount || !dueDay || !type || type === "none") {
      return;
    }

    setIsLoading(true);

    if (template) {
      await $ExpenseTemplate.update(template.id, { title, amount, dueDay, type });
    } else {
      await $ExpenseTemplate.create({ title, amount, dueDay, type, userId: user!.uid });
    }

    await refresh();

    setIsLoading(false);

    onClose();
  }

  return (
    <Dialog maxWidth="sm" open={open} fullWidth onClose={onClose}>
      <DialogContent>
        <Stack id="expense-form" component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Stack spacing={2}>
            <TextField label="Título" name="title" fullWidth required defaultValue={template?.title} />
            <NumericFormat
              customInput={TextField}
              label="Monto"
              name="amount"
              sx={{ width: "100%" }}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
              }}
              thousandSeparator
              fullWidth
              required
              defaultValue={template?.amount}
            />
            <TextField label="Día típico de vencimiento" type="number" name="dueDay" fullWidth required defaultValue={template?.dueDay} />
            <TextField label="Tipo" name="type" defaultValue={template?.type || "none"} select fullWidth>
              <MenuItem value="none" disabled>
                Seleccionar tipo
              </MenuItem>
              <MenuItem value="monthly">Mensual</MenuItem>
              <MenuItem value="annual">Anual</MenuItem>
            </TextField>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" fullWidth onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" type="submit" form="expense-form" loading={isLoading} fullWidth>
          {template ? "Editar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseFormDialog;
