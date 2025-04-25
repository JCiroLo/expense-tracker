import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import useExpenseStore from "@/stores/use-expense-store";
import { ExpenseType } from "@/types/expense";

type ExpenseFormDialogProps = {
  open: boolean;
  onClose: () => void;
};

const ExpenseFormDialog: React.FC<ExpenseFormDialogProps> = ({
  open,
  onClose,
}) => {
  const addTemplate = useExpenseStore((state) => state.addTemplate);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const dueDay = Number(formData.get("dueDay"));
    const type = formData.get("type") as ExpenseType | "none";
    const rawAmount = formData.get("amount") as string;
    const amount = Number(rawAmount.replaceAll(",", ""));

    if (Number.isNaN(amount)) {
      return;
    }

    if (!name || !amount || !dueDay || !type || type === "none") {
      return;
    }

    addTemplate({
      name,
      amount,
      dueDay,
      type,
    });

    onClose();
  };

  return (
    <Dialog maxWidth="sm" open={open} fullWidth onClose={onClose}>
      <DialogContent>
        <Stack
          id="expense-form"
          component="form"
          onSubmit={handleSubmit}
          sx={{ mb: 3, mt: 1 }}
        >
          <Stack spacing={2}>
            <TextField label="Nombre" name="name" fullWidth required />
            <NumericFormat
              customInput={TextField}
              label="Monto"
              name="amount"
              sx={{ width: "100%" }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
              thousandSeparator
              fullWidth
              required
            />
            <TextField
              label="Día típico de vencimiento"
              type="number"
              name="dueDay"
              fullWidth
              required
            />
            <TextField
              label="Tipo"
              name="type"
              defaultValue="none"
              select
              fullWidth
            >
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
          Cancear
        </Button>
        <Button variant="contained" type="submit" form="expense-form" fullWidth>
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpenseFormDialog;
