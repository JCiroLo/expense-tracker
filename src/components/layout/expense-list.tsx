import { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  ListItemButton,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
} from "@mui/material";
import EllipsisIcon from "@/components/icons/ellipsis-icon";
import useExpenseTracker from "@/hooks/use-expense-tracker";
import CurrencyTools from "@/tools/currency-tools";
import TrackerTools from "@/tools/tracker-tools";
import { ExpenseRecord, ExpenseTemplate } from "@/types/expense";
import $ExpenseRecord from "@/services/expense-record";

const ExpenseList = () => {
  const { templates, records, refresh } = useExpenseTracker();

  const [menuAnchor, setMenuAnchor] = useState({
    template: null as ExpenseTemplate | null,
    record: null as ExpenseRecord | null,
    element: null as HTMLElement | null,
    isPaid: false,
  });
  const [isLoading, setIsLoading] = useState({
    template: null as ExpenseTemplate | null,
  });

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>, template: ExpenseTemplate) {
    const record = records.indexed[TrackerTools.getRecordKey({ templateId: template.id, type: template.type })] || null;
    const paid = Boolean(record);

    setMenuAnchor({
      template,
      record,
      element: event.currentTarget,
      isPaid: paid,
    });
  }

  function handleMenuClose() {
    setMenuAnchor((prev) => ({
      template: null,
      record: null,
      element: null,
      isPaid: prev.isPaid,
    }));
  }

  async function handleMarkAsPaid(template: ExpenseTemplate) {
    const now = new Date();

    setIsLoading((prev) => ({ ...prev, template }));

    const record = await $ExpenseRecord.create({
      templateId: template.id,
      templateType: template.type,
      userId: template.userId,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      paidAt: now,
      cancelled: false,
      cancelledAt: null,
    });

    if (record.ok) {
      await refresh();
    }

    setIsLoading((prev) => ({ ...prev, template: null }));
  }

  async function handleMarkAsUnpaid(template: ExpenseTemplate, record: ExpenseRecord) {
    setIsLoading((prev) => ({ ...prev, template }));

    const response = await $ExpenseRecord.delete(record.id);

    if (response.ok) {
      await refresh();
    }

    setIsLoading((prev) => ({ ...prev, template: null }));
  }

  if (templates.length === 0) {
    return (
      <Typography textAlign="center" mt={4} color="text.secondary">
        No hay gastos para mostrar.
      </Typography>
    );
  }

  return (
    <>
      <List disablePadding>
        {[...templates, ...templates, ...templates, ...templates, ...templates, ...templates, ...templates].map((template) => {
          const paid = Boolean(records.indexed[TrackerTools.getRecordKey({ templateId: template.id, type: template.type })]);
          const loading = isLoading.template?.id === template.id;

          return (
            <ListItem
              key={template.id}
              secondaryAction={
                <IconButton edge="end" onClick={(event) => handleMenuOpen(event, template)}>
                  <EllipsisIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton
                disabled={paid || loading}
                sx={{ borderRadius: 1 }}
                dense
                disableGutters
                onClick={() => handleMarkAsPaid(template)}
              >
                {loading ? <CircularProgress size={42} sx={{ padding: "9px" }} /> : <Checkbox checked={paid} tabIndex={-1} disableRipple />}

                <ListItemText
                  primary={`${template.title} - ${CurrencyTools.format(template.amount)}`}
                  secondary={`Día de vencimiento: ${template.dueDay}`}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Menu
        open={Boolean(menuAnchor.element)}
        anchorEl={menuAnchor.element}
        slotProps={{
          paper: {
            style: {},
          },
        }}
        onClose={handleMenuClose}
      >
        {menuAnchor.isPaid ? (
          <MenuItem
            onClick={() => {
              handleMarkAsUnpaid(menuAnchor.template!, menuAnchor.record!);
              handleMenuClose();
            }}
          >
            Marcar como no pagado
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              handleMarkAsPaid(menuAnchor.template!);
              handleMenuClose();
            }}
          >
            Marcar como pagado
          </MenuItem>
        )}
        <Divider />
        <MenuItem disabled>Editar gasto</MenuItem>
      </Menu>
    </>
  );
};

export default ExpenseList;
