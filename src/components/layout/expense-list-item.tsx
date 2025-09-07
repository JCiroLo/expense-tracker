import React, { useMemo } from "react";
import { Checkbox, CircularProgress, IconButton, ListItem, ListItemButton, ListItemText } from "@mui/material";
import EllipsisIcon from "@/components/icons/ellipsis-icon";
import useExpenseTracker from "@/hooks/use-expense-tracker";
import useHighlighter from "@/hooks/use-highlighter";
import CurrencyTools from "@/tools/currency-tools";
import DateTools from "@/tools/date-tools";
import type { ExpenseTemplate } from "@/types/expense";

type ExpenseListItemProps = {
  template: ExpenseTemplate;
  loading: boolean;
  onCheck: (template: ExpenseTemplate) => void;
  onMenu: (event: React.MouseEvent<HTMLElement>, template: ExpenseTemplate) => void;
};

const ExpenseListItem: React.FC<ExpenseListItemProps> = ({ template, loading, onCheck, onMenu }) => {
  const { records } = useExpenseTracker();
  const highlighter = useHighlighter();

  const record = useMemo(() => records.indexed[template.id], [template.id, records.indexed]);

  const helperText = useMemo(() => {
    if (template.type === "one-time") {
      return `Pago único hecho el ${DateTools.format(record.created_at, "d [de] MMMM [del] YYYY")}`;
    }

    if (record) {
      return `Pagado el ${DateTools.format(record.created_at, "d [de] MMMM [del] YYYY")}`;
    }

    if (template.type === "annual") {
      return `Mes de vencimiento: ${DateTools.monthName(template.due_month!)}`;
    }

    return `Día de vencimiento: ${template.due_day} de ${DateTools.monthName()}`;
  }, [template, record]);

  const paid = Boolean(record);

  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" color="inherit" onClick={(event) => onMenu(event, template)}>
          <EllipsisIcon />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton
        selected={highlighter.id === template.id}
        disabled={paid || loading}
        sx={{ borderRadius: 1 }}
        dense
        disableGutters
        onClick={() => onCheck(template)}
      >
        {loading ? <CircularProgress size={42} sx={{ padding: "9px" }} /> : <Checkbox checked={paid} tabIndex={-1} disableRipple />}

        <ListItemText primary={`${template.title} - ${CurrencyTools.format(template.amount)}`} secondary={helperText} />
      </ListItemButton>
    </ListItem>
  );
};

export default ExpenseListItem;
