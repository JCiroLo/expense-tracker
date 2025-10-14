import { useMemo, useState } from "react";
import { Menu, MenuItem, Divider, ListItemIcon } from "@mui/material";
import IncomeListItem from "@/components/layout/income-list-item";
import CheckIcon from "@/components/icons/check-icon";
import EditIcon from "@/components/icons/edit-icon";
import TimesIcon from "@/components/icons/times-icon";
import TrashIcon from "@/components/icons/trash-icon";
import useDialog from "@/hooks/use-dialog";
import useIncomes from "@/hooks/use-incomes";
import useFilters from "@/hooks/use-filters";
import useSettingsStore from "@/stores/use-settings-store";
import $IncomeRecord from "@/services/income-record";
import type { IncomeRecord, IncomeTemplate } from "@/types/income";

const IncomeList = () => {
  const selectedTab = useSettingsStore((state) => state.selectedTab);
  const dialog = useDialog();

  const { templates, records, refresh } = useIncomes();
  const { filters } = useFilters();

  const [menuAnchor, setMenuAnchor] = useState({
    template: null as IncomeTemplate | null,
    record: null as IncomeRecord | null,
    element: null as HTMLElement | null,
    isPaid: false,
  });
  const [isLoading, setIsLoading] = useState({
    template: null as IncomeTemplate | null,
  });

  const selectedTemplates = useMemo(
    () => [...templates[selectedTab], ...(selectedTab === "monthly" ? templates.oneTime : [])],
    [selectedTab, templates]
  );

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>, template: IncomeTemplate) {
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

  async function handleMarkAsPaid(template: IncomeTemplate) {
    setIsLoading((prev) => ({ ...prev, template }));

    const record = await $IncomeRecord.create({
      category_id: template.category_id,
      paid_at_month: filters.month,
      paid_at_year: filters.year,
      template_id: template.id,
      user_id: template.user_id,
    });

    if (!record.error) {
      await refresh.records();
    }

    setIsLoading((prev) => ({ ...prev, template: null }));
  }

  async function handleMarkAsUnpaid(template: IncomeTemplate, record: IncomeRecord) {
    setIsLoading((prev) => ({ ...prev, template }));

    const response = await $IncomeRecord.delete(record.id);

    if (!response.error) {
      await refresh.records();
    }

    setIsLoading((prev) => ({ ...prev, template: null }));
  }

  return (
    <>
      {selectedTemplates.map((template) => (
        <IncomeListItem
          key={template.id}
          template={template}
          loading={isLoading.template?.id === template.id}
          onCheck={handleMarkAsPaid}
          onMenu={handleMenuOpen}
        />
      ))}
      <Menu open={Boolean(menuAnchor.element)} anchorEl={menuAnchor.element} onClose={handleMenuClose}>
        {menuAnchor.isPaid ? (
          <MenuItem
            disabled={menuAnchor.template?.type === "one-time"}
            onClick={() => {
              handleMarkAsUnpaid(menuAnchor.template!, menuAnchor.record!);
              handleMenuClose();
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <TimesIcon fontSize="small" />
            </ListItemIcon>
            Marcar como no recibido
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              handleMarkAsPaid(menuAnchor.template!);
              handleMenuClose();
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <CheckIcon fontSize="small" />
            </ListItemIcon>
            Marcar como recibido
          </MenuItem>
        )}
        <Divider />
        <MenuItem
          disabled={menuAnchor.template?.type === "one-time"}
          onClick={() => {
            dialog.open("manage-income-template", menuAnchor.template);
            handleMenuClose();
          }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Editar ingreso
        </MenuItem>
        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            dialog.open("remove-income-template", menuAnchor.template);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <TrashIcon fontSize="small" color="error" />
          </ListItemIcon>
          Eliminar ingreso
        </MenuItem>
      </Menu>
    </>
  );
};

export default IncomeList;
