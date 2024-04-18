import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ThemeState {
  theme: string;
  toggleTheme: () => void;
}

const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme: () => {
        set((state) => {
          if (state.theme === "dark") {
            return { ...state, theme: "light" };
          } else {
            return { ...state, theme: "dark" };
          }
        });
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useTheme;
