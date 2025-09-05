import React from "react";
import { Paper, Stack, Tab, Tabs } from "@mui/material";
import useSettingsStore from "@/stores/use-settings-store";
import type { Tab as TabType } from "@/types/global";

const NavigationTabs = () => {
  const { selectedTab, setSelectedTab } = useSettingsStore();

  const handleTabChange = (_: React.SyntheticEvent, tab: TabType) => {
    setSelectedTab(tab);
  };

  return (
    <Stack component={Paper} elevation={0} marginTop={1}>
      <Tabs value={selectedTab} centered onChange={handleTabChange}>
        <Tab label="Mensuales" value="monthly" />
        <Tab label="Anuales" value="annual" />
      </Tabs>
    </Stack>
  );
};

export default NavigationTabs;
