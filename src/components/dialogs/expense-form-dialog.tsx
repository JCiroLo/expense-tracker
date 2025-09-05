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
import ExpenseCategoryForm, { type ExpenseCategoryFormObject } from "@/forms/expense-category-form";
import ExpenseTemplateForm, { type ExpenseTemplateFormObject } from "@/forms/expense-template-form";
import $ExpenseCategory from "@/services/expense-category";
import $ExpenseTemplate from "@/services/expense-template";
import $ExpenseRecord from "@/services/expense-record";
import useSessionStore from "@/stores/use-session-store";
import DateTools from "@/tools/date-tools";
import type { ExpenseCategory, ExpenseType } from "@/types/expense";
import type { ExpenseTemplate } from "@/types/expense";

type ExpenseFormDialogProps = {
  open: boolean;
  onClose: () => void;
  template?: ExpenseTemplate;
};

const ExpenseFormDialog: React.FC<ExpenseFormDialogProps> = ({ open, onClose, template }) => {
  const user = useSessionStore((state) => state.user);
  const { categories, filters, refresh } = useExpenseTracker();

  const [type, setType] = React.useState<ExpenseType | "none">("none");
  const [category, setCategory] = React.useState<string | "add-category" | "none">(template?.category_id || "none");
  const [isLoading, setIsLoading] = React.useState(false);

  function handleTypeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value as ExpenseType | "none";

    setType(value);
  }

  function handleCategoryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setCategory(value);
  }

  async function handleCategoryCreation(formData: ExpenseCategoryFormObject) {
    const response = await $ExpenseCategory.create({ name: formData.name, color: formData.color, user_id: user!.uid });

    if (response.error) {
      // TODO: show error and try again message
      return null;
    }

    return response.data;
  }

  async function handleOneTimeCreation(formData: ExpenseTemplateFormObject) {
    const template = await $ExpenseTemplate.create({
      amount: formData.amount,
      category_id: formData.categoryId,
      due_day: DateTools.day,
      due_month: DateTools.month,
      title: formData.title,
      type: formData.type,
      user_id: user!.uid,
    });

    if (template.error) {
      // TODO: show error and try again message
      return null;
    }

    const record = await $ExpenseRecord.create({
      category_id: formData.categoryId,
      paid_at_month: filters.month,
      paid_at_year: filters.year,
      template_id: template.data.id,
      user_id: user!.uid,
    });

    if (record.error) {
      return null;
    }

    return {
      template: template.data,
      record: record.data,
    };
  }

  async function handleTemplateCreation(formData: ExpenseTemplateFormObject) {
    if (type === "none") {
      return;
    }

    if (template) {
      await $ExpenseTemplate.update(template.id, {
        type,
        amount: formData.amount,
        category_id: formData.categoryId,
        due_day: formData.dueDay,
        due_month: formData.dueMonth,
        title: formData.title,
      });
    } else {
      await $ExpenseTemplate.create({
        type,
        amount: formData.amount,
        category_id: formData.categoryId,
        due_day: formData.dueDay,
        due_month: formData.dueMonth,
        title: formData.title,
        user_id: user!.uid,
      });
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    let newCategory: ExpenseCategory | null = null;
    const formData = new FormData(event.target as HTMLFormElement);
    const formCategory = ExpenseCategoryForm.toObject(formData);
    const formTemplate = ExpenseTemplateForm.toObject(formData);

    // Step 1: validate form

    if (Number.isNaN(formTemplate.amount)) {
      return;
    }

    if (!formTemplate.title || !formTemplate.amount || !type || type === "none") {
      return;
    }

    if (type === "monthly" && !formTemplate.dueDay) {
      return;
    }

    if (type === "annual" && !formTemplate.dueMonth) {
      return;
    }

    // Step 2: create category if needed

    if (formTemplate.categoryId === "add-category") {
      // Step 2a: validate category form

      if (!formCategory.name) {
        return;
      }

      setIsLoading(true);

      // Step 2b: create category

      newCategory = await handleCategoryCreation(formCategory);

      if (!newCategory) {
        setIsLoading(false);
        // TODO: show error and try again message
        return;
      }
    }

    // Step 3: create or update template

    setIsLoading(true);

    const categoryId = newCategory ? newCategory.id : formTemplate.categoryId === "none" ? null : formTemplate.categoryId;

    if (type === "one-time") {
      const response = await handleOneTimeCreation({ ...formTemplate, categoryId });

      if (!response) {
        setIsLoading(false);
        // TODO: show error and try again message
        return;
      }
    } else {
      await handleTemplateCreation({ ...formTemplate, categoryId });
    }

    await refresh.records();

    setIsLoading(false);

    onClose();
  }

  React.useEffect(() => {
    if (template) {
      setType(template.type);
      setCategory(template.category_id || "none");
    } else {
      setType("none");
      setCategory("none");
    }
  }, [template]);

  return (
    <Dialog maxWidth="sm" open={open} fullWidth onClose={onClose}>
      <DialogTitle>{template ? "Editar pago" : "Agregar pago"}</DialogTitle>
      <DialogContent>
        <Stack id="expense-form" component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Stack spacing={2}>
            <TextField label="Título" name={ExpenseTemplateForm.formKeys.title} fullWidth required defaultValue={template?.title} />
            <NumericFormat
              customInput={TextField}
              label="Monto"
              name={ExpenseTemplateForm.formKeys.amount}
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
            <TextField
              label="Tipo"
              name={ExpenseTemplateForm.formKeys.type}
              value={type}
              select
              fullWidth
              required
              onChange={handleTypeChange}
            >
              <MenuItem value="none" disabled>
                Seleccionar tipo
              </MenuItem>
              <MenuItem value="monthly">Mensual</MenuItem>
              <MenuItem value="annual">Anual</MenuItem>
              <MenuItem value="one-time">Pago único</MenuItem>
            </TextField>
            {type !== "none" && type !== "one-time" && (
              <>
                {type === "monthly" ? (
                  <TextField
                    label="Día típico de vencimiento"
                    type="number"
                    name={ExpenseTemplateForm.formKeys.dueDay}
                    defaultValue={template?.due_day}
                    fullWidth
                    required
                  />
                ) : (
                  <TextField
                    label="Mes típico de vencimiento"
                    name={ExpenseTemplateForm.formKeys.dueMonth}
                    defaultValue={template?.due_month || "none"}
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
            <TextField
              label="Categoría"
              name={ExpenseTemplateForm.formKeys.categoryId}
              value={category}
              select
              fullWidth
              onChange={handleCategoryChange}
            >
              <MenuItem value="none">Sin categoría</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
              <Divider />
              <MenuItem value="add-category">Agregar categoría</MenuItem>
            </TextField>
            {category === "add-category" && (
              <>
                <TextField label="Nombre de la categoría" name={ExpenseCategoryForm.formKeys.name} fullWidth required />
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
