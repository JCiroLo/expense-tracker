import React, { useMemo } from "react";
import { Checkbox, CircularProgress, IconButton, ListItem, ListItemButton, ListItemText } from "@mui/material";
import ArrowUpIcon from "@/components/icons/arrow-up-icon";
import EllipsisIcon from "@/components/icons/ellipsis-icon";
import useIncomes from "@/hooks/use-incomes";
import useHighlighter from "@/hooks/use-highlighter";
import CurrencyTools from "@/tools/currency-tools";
import DateTools from "@/tools/date-tools";
import type { IncomeTemplate } from "@/types/income";

type IncomeListItemProps = {
  template: IncomeTemplate;
  loading: boolean;
  onCheck: (template: IncomeTemplate) => void;
  onMenu: (event: React.MouseEvent<HTMLElement>, template: IncomeTemplate) => void;
};

const IncomeListItem: React.FC<IncomeListItemProps> = ({ template, loading, onCheck, onMenu }) => {
  const highlighter = useHighlighter();
  const { records } = useIncomes();

  const record = useMemo(() => records.indexed[template.id], [template.id, records.indexed]);

  const helperText = useMemo(() => {
    if (template.type === "one-time") {
      if (record) {
        return `Ingreso único recibido el ${DateTools.format(record.created_at, "D [de] MMMM [del] YYYY")}`;
      }

      return "Ingreso único pendiente de recibir";
    }

    if (record) {
      return `Recibido el ${DateTools.format(record.created_at, "D [de] MMMM [del] YYYY")}`;
    }

    if (template.type === "annual") {
      return `Mes esperado de ingreso: ${DateTools.monthName(template.due_month!)}`;
    }

    return `Día esperado de ingreso: ${template.due_day} de ${DateTools.monthName()}`;
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
        <ArrowUpIcon color="success" sx={{ fontSize: 20, mr: 1 }} />
        <ListItemText primary={`${template.title} - ${CurrencyTools.format(template.amount)}`} secondary={helperText} />
      </ListItemButton>
    </ListItem>
  );
};

export default IncomeListItem;
