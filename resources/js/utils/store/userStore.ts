import { create } from "zustand";

type UserStore = {
    showLoginSuccess: boolean,
}

export const useUserStore = create<UserStore>((set) => ({
    showLoginSuccess: false,
    setShowLoginSuccess: (showLoginSuccess: boolean) => set(() => ({ showLoginSuccess: showLoginSuccess })),
}))
