import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AccentColor, Tab } from "@/types/global";

type SettingsState = {
  selectedTab: Tab;
  accentColor: AccentColor;
  setSelectedTab: (tab: Tab) => void;
  setAccentColor: (color: AccentColor) => void;
};

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      selectedTab: "monthly",
      accentColor: "ant",

      setSelectedTab: (tab) => set({ selectedTab: tab }),
      setAccentColor: (color) => set({ accentColor: color }),
    }),
    {
      name: "settings-storage",
      version: 0.3,
    }
  )
);

export default useSettingsStore;
