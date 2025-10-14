import React from "react";
import { Tooltip } from "@mui/material";
import ArrowUpIcon from "@/components/icons/arrow-up-icon";
import ArrowDownIcon from "@/components/icons/arrow-down-icon";

type TemplateTypeIconProps = {
  type: "income" | "expense";
  oneTime?: boolean;
};

const TemplateTypeIcon: React.FC<TemplateTypeIconProps> = ({ type }) => {
  return (
    <Tooltip title={type === "expense" ? "Gasto" : "Ingreso"} placement="top" arrow>
      {type === "expense" ? (
        <ArrowDownIcon color="error" sx={{ fontSize: 20, mr: 1 }} />
      ) : (
        <ArrowUpIcon color="success" sx={{ fontSize: 20, mr: 1 }} />
      )}
    </Tooltip>
  );
};

export default TemplateTypeIcon;
