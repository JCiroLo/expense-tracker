import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Tab } from "@/types/global";

type SettingsState = {
  selectedTab: Tab;
  setSelectedTab: (tab: Tab) => void;
};

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      selectedTab: "monthly",

      setSelectedTab: (tab) => set({ selectedTab: tab }),
    }),
    {
      name: "settings-storage",
    }
  )
);

export default useSettingsStore;
