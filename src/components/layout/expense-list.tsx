import { forwardRef } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  ListItemButton,
} from "@mui/material";
import { ExpenseTemplate } from "@/types/expense";
import useExpenseStore from "@/stores/use-expense-store";
import DateTools from "@/lib/date-tools";

type ExpenseListProps = {
  expenses: ExpenseTemplate[];
};

const ExpenseList = forwardRef<HTMLUListElement, ExpenseListProps>(
  ({ expenses }, ref) => {
    const { isPaid, markAsPaid } = useExpenseStore();

    if (expenses.length === 0) {
      return (
        <Typography textAlign="center" mt={4} color="text.secondary">
          No hay gastos para mostrar.
        </Typography>
      );
    }

    return (
      <List ref={ref} disablePadding>
        {expenses.map((template) => {
          const paid = isPaid(template.id, template.type, DateTools.now);

          return (
            <ListItemButton
              key={template.id}
              disabled={paid}
              sx={{ borderRadius: 1 }}
              disableGutters
              onClick={() =>
                !paid && markAsPaid(template.id, template.type, DateTools.now)
              }
            >
              <ListItem disablePadding>
                <Checkbox checked={paid} tabIndex={-1} disableRipple />
                <ListItemText
                  primary={`${template.name} - $${template.amount}`}
                  secondary={`Día de vencimiento: ${template.dueDay}`}
                />
              </ListItem>
            </ListItemButton>
          );
        })}
      </List>
    );
  }
);

export default ExpenseList;
