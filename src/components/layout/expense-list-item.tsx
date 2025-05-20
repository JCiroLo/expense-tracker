import React, { useMemo } from "react";
import { Checkbox, CircularProgress, IconButton, ListItem, ListItemButton, ListItemText } from "@mui/material";
import EllipsisIcon from "@/components/icons/ellipsis-icon";
import useExpenseTracker from "@/hooks/use-expense-tracker";
import useHighlighter from "@/hooks/use-highlighter";
import CurrencyTools from "@/tools/currency-tools";
import TrackerTools from "@/tools/tracker-tools";
import { ExpenseTemplate } from "@/types/expense";

type ExpenseListItemProps = {
  template: ExpenseTemplate;
  loading: boolean;
  onCheck: (template: ExpenseTemplate) => void;
  onMenu: (event: React.MouseEvent<HTMLElement>, template: ExpenseTemplate) => void;
};

const ExpenseListItem: React.FC<ExpenseListItemProps> = ({ template, loading, onCheck, onMenu }) => {
  const { records } = useExpenseTracker();
  const highlighter = useHighlighter();

  const paid = useMemo(
    () => Boolean(records.indexed[TrackerTools.getRecordKey({ templateId: template.id, type: template.type })]),
    [template.id, template.type, records.indexed]
  );

  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" onClick={(event) => onMenu(event, template)}>
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

        <ListItemText
          primary={`${template.title} - ${CurrencyTools.format(template.amount)}`}
          secondary={`Día de vencimiento: ${template.dueDay}`}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default ExpenseListItem;
