import { useMemo, useState } from "react";
import { List, Typography, Menu, MenuItem, Divider } from "@mui/material";
import useExpenseTracker from "@/hooks/use-expense-tracker";
import useSettingsStore from "@/stores/use-settings-store";
import $ExpenseRecord from "@/services/expense-record";
import { ExpenseRecord, ExpenseTemplate } from "@/types/expense";
import ExpenseListItem from "./expense-list-item";
import useDialog from "@/hooks/use-dialog";

const ExpenseList = () => {
  const { templates, records, refresh } = useExpenseTracker();
  const selectedTab = useSettingsStore((state) => state.selectedTab);
  const dialog = useDialog();

  const [menuAnchor, setMenuAnchor] = useState({
    template: null as ExpenseTemplate | null,
    record: null as ExpenseRecord | null,
    element: null as HTMLElement | null,
    isPaid: false,
  });
  const [isLoading, setIsLoading] = useState({
    template: null as ExpenseTemplate | null,
  });

  const selectedTemplates = useMemo(() => templates[selectedTab], [selectedTab, templates]);

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>, template: ExpenseTemplate) {
    const record = records.indexed[template.id] || null;
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
      type: template.type,
      userId: template.userId,
      paidAtYear: now.getFullYear(),
      paidAtMonth: now.getMonth(),
      paidAt: now,
      title: template.title,
      amount: template.amount,
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

  return (
    <>
      <List sx={{ height: "100%", overflowY: "auto" }} disablePadding>
        {selectedTemplates.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ my: 2 }}>
            No hay gastos registrados.
          </Typography>
        ) : (
          selectedTemplates.map((template) => (
            <ExpenseListItem
              key={template.id}
              template={template}
              loading={isLoading.template?.id === template.id}
              onCheck={handleMarkAsPaid}
              onMenu={handleMenuOpen}
            />
          ))
        )}
      </List>
      <Menu open={Boolean(menuAnchor.element)} anchorEl={menuAnchor.element} onClose={handleMenuClose}>
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
        <MenuItem
          onClick={() => {
            dialog.open("manage-expense-template", menuAnchor.template);
            handleMenuClose();
          }}
        >
          Editar gasto
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExpenseList;
