import React, { useMemo } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  useColorScheme,
  useMediaQuery,
} from "@mui/material";
import EyeIcon from "@/components/icons/eye-icon";
import UserIcon from "@/components/icons/user-icon";
import ChevronLeftIcon from "../icons/chevron-left-icon";

type SettingsDialogProps = {
  open: boolean;
  onClose: () => void;
};

type SectionValue = "appearance" | "account";

type Section = {
  label: string;
  icon: React.ReactNode;
  value: SectionValue | null;
};

const SECTIONS: Record<SectionValue, Section> = {
  appearance: {
    label: "Apariencia",
    icon: <EyeIcon />,
    value: "appearance",
  },
  account: {
    label: "Cuenta",
    icon: <UserIcon />,
    value: "account",
  },
};

const SettingsAppearance = () => {
  const { mode, setMode } = useColorScheme();

  const handleThemeModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMode(event.target.value as "light" | "dark" | "system");
  };

  return (
    <>
      <ListItem
        secondaryAction={
          <TextField value={mode} size="small" select onChange={handleThemeModeChange}>
            <MenuItem value="light">Claro</MenuItem>
            <MenuItem value="dark">Oscuro</MenuItem>
            <MenuItem value="system">Sistema</MenuItem>
          </TextField>
        }
        sx={{ paddingRight: 14 }}
      >
        <ListItemText primary="Tema" secondary="Personaliza el tema del sitio web" />
      </ListItem>
    </>
  );
};

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [section, setSection] = React.useState<SectionValue | null>(() => (isMobile ? null : "appearance"));

  const sections = useMemo(() => Object.values(SECTIONS), []);

  const title = section ? SECTIONS[section].label : "Ajustes";

  const handleSectionChange = (_: React.SyntheticEvent, newValue: SectionValue) => {
    setSection(newValue);
  };

  return (
    <Dialog maxWidth="sm" open={open} fullWidth onClose={onClose}>
      <DialogTitle display={{ xs: "none", sm: "block" }}>Ajustes</DialogTitle>
      <DialogTitle display={{ xs: "block", sm: "none" }}>{title}</DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Tabs
            value={section}
            orientation="vertical"
            sx={{ display: { xs: "none", sm: "initial" }, borderRight: 1, borderColor: "divider" }}
            centered
            onChange={handleSectionChange}
          >
            {sections.map((section) => (
              <Tab key={section.value} label={section.label} value={section.value} disabled={section.value === "account"} />
            ))}
          </Tabs>
          <List sx={{ display: !section ? { xs: "initial", sm: "none" } : "none" }} disablePadding>
            {sections.map((section) => (
              <ListItem key={section.value} disablePadding>
                <ListItemButton disabled={section.value === "account"} onClick={() => setSection(section.value as SectionValue)}>
                  <ListItemIcon sx={{ minWidth: 40 }}>{section.icon}</ListItemIcon>
                  <ListItemText primary={section.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {section && (
            <List sx={{ flexGrow: 1 }} disablePadding>
              <Button
                variant="text"
                role="listitem"
                startIcon={<ChevronLeftIcon />}
                sx={{ display: { xs: "flex", sm: "none" }, padding: 0 }}
                onClick={() => setSection(null)}
              >
                Ajustes
              </Button>
              {section === "appearance" && <SettingsAppearance />}
            </List>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
