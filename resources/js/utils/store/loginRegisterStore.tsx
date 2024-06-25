import { create } from "zustand";

type LoginRegisterStore = {
    showLogin: boolean,
    showRegister: boolean,
    setShowLogin: (showLogin: boolean) => void,
    setShowRegister: (showRegister: boolean) => void,
}

export const useLoginRegisterStore = create<LoginRegisterStore>((set) => ({
    showLogin: false,
    showRegister: false,
    setShowLogin: (showLogin: boolean) => set(() => ({ showLogin: showLogin })),
    setShowRegister: (showRegister: boolean) => set(() => ({ showRegister: showRegister })),
}))
