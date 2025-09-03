import React from "react";
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  InputAdornment,
  DialogTitle,
  Divider,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import useExpenseTracker from "@/hooks/use-expense-tracker";
import $ExpenseCategory from "@/services/expense-category";
import $ExpenseTemplate from "@/services/expense-template";
import useSessionStore from "@/stores/use-session-store";
import DateTools from "@/tools/date-tools";
import type { ExpenseType } from "@/types/expense";
import type { ExpenseTemplate } from "@/types/expense";

type ExpenseFormDialogProps = {
  open: boolean;
  onClose: () => void;
  template?: ExpenseTemplate;
};

const ExpenseFormDialog: React.FC<ExpenseFormDialogProps> = ({ open, onClose, template }) => {
  const user = useSessionStore((state) => state.user);
  const { categories, refresh } = useExpenseTracker();

  const [type, setType] = React.useState<ExpenseType | "none">("none");
  const [category, setCategory] = React.useState<string | "add-category" | "none">(template?.categoryId || "none");
  const [isLoading, setIsLoading] = React.useState(false);

  function handleTypeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value as ExpenseType | "none";

    setType(value);
  }

  function handleCategoryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setCategory(value);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const dueDay = Number(formData.get("dueDay")) || null;
    const dueMonth = Number(formData.get("dueMonth")) || null;
    const type = formData.get("type") as ExpenseType | "none";
    const rawAmount = formData.get("amount") as string;
    const amount = Number(rawAmount.replaceAll(",", ""));
    const categoryId = formData.get("categoryId") as string;
    const categoryName = formData.get("categoryName") as string;

    if (Number.isNaN(amount)) {
      return;
    }

    if (!title || !amount || !type || type === "none") {
      return;
    }

    if (type === "monthly" && !dueDay) {
      return;
    }

    if (type === "annual" && !dueMonth) {
      return;
    }

    if (categoryId === "add-category" && !categoryName) {
      return;
    }

    setIsLoading(true);

    let newCategoryId = categoryId;

    if (categoryId === "add-category") {
      const response = await $ExpenseCategory.create({ name: categoryName, color: "#000000", userId: user!.uid });

      if (!response.ok) {
        setIsLoading(false);

        // TODO: show error and try again message
        return;
      }

      newCategoryId = response.data.id;
    }

    if (template) {
      // TODO: update categoryId if changed
      await $ExpenseTemplate.update(template.id, { title, amount, dueDay, dueMonth, type });
    } else {
      await $ExpenseTemplate.create({ title, amount, dueDay, dueMonth, type, categoryId: newCategoryId, userId: user!.uid });
    }

    await refresh();

    setIsLoading(false);

    onClose();
  }

  React.useEffect(() => {
    if (template) {
      setType(template.type);
    } else {
      setType("none");
    }
  }, [template]);

  return (
    <Dialog maxWidth="sm" open={open} fullWidth onClose={onClose}>
      <DialogTitle>{template ? "Editar pago" : "Agregar pago"}</DialogTitle>
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
            <TextField label="Tipo" name="type" value={type} select fullWidth required onChange={handleTypeChange}>
              <MenuItem value="none" disabled>
                Seleccionar tipo
              </MenuItem>
              <MenuItem value="monthly">Mensual</MenuItem>
              <MenuItem value="annual">Anual</MenuItem>
              {/* <MenuItem value="one-time">Pago único</MenuItem> */}
            </TextField>
            {type !== "none" && type !== "one-time" && (
              <>
                {type === "monthly" ? (
                  <TextField
                    label="Día típico de vencimiento"
                    type="number"
                    name="dueDay"
                    defaultValue={template?.dueDay}
                    fullWidth
                    required
                  />
                ) : (
                  <TextField
                    label="Mes típico de vencimiento"
                    name="dueMonth"
                    defaultValue={template?.dueMonth || "none"}
                    select
                    fullWidth
                    required
                  >
                    <MenuItem value="none" disabled>
                      Seleccionar mes
                    </MenuItem>
                    {DateTools.months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </>
            )}
            <TextField label="Categoría" name="categoryId" value={category} select fullWidth onChange={handleCategoryChange}>
              <MenuItem value="none">Sin categoría</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id} color={category.color}>
                  {category.name}
                </MenuItem>
              ))}
              <Divider />
              <MenuItem value="add-category">Agregar categoría</MenuItem>
            </TextField>
            {category === "add-category" && (
              <>
                <TextField label="Nombre de la categoría" name="categoryName" fullWidth required />
              </>
            )}
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
