import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Userinfo = {
  email: string;
  phone: string;
  token: string;
  refreshToken: string;
};

interface UserState {
  userinfo: Userinfo;
  setUserinfo: (userinfo: Userinfo) => void;
  clearUserinfo: () => void;
  getUserinfo: () => Userinfo | null;
}

const useUser = create<UserState>()(
  persist(
    (set, get) => ({
      userinfo: {
        email: "",
        phone: "",
        token: "",
        refreshToken: "",
      },
      getUserinfo: () => {
        if (typeof window !== "undefined") {
          const state = get();
          return state.userinfo;
        }
        return null;
      },
      clearUserinfo: () => {
        set((state) => {
          return {
            ...state,
            userinfo: {
              email: "",
              phone: "",
              token: "",
              refreshToken: "",
            },
          };
        });
      },
      setUserinfo: (userinfo: Userinfo) => {
        set((state) => {
          return {
            ...state,
            userinfo: userinfo,
          };
        });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useUser;
