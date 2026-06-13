import { create } from "zustand";

export type ThemePreference = "cinema" | "obsidian";

type PreferencesStore = {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
};

const STORAGE_KEY = "mnemoscope.preferences.v1";

function readTheme(): ThemePreference {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as {
      theme?: ThemePreference;
    };
    return stored.theme === "obsidian" ? "obsidian" : "cinema";
  } catch {
    return "cinema";
  }
}

export const usePreferencesStore = create<PreferencesStore>((set) => ({
  theme: readTheme(),
  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme }));
    document.documentElement.dataset.theme = theme;
    set({ theme });
  },
}));

