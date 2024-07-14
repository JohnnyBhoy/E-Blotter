import { create } from "zustand";

type LoginRegisterStore = {
    showLogin: boolean,
    showRegister: boolean,
    showLogout: boolean,
    setShowLogin: (showLogin: boolean) => void,
    setShowRegister: (showRegister: boolean) => void,
    setShowLogout: (showLogout: boolean) => void,
}

export const useLoginRegisterStore = create<LoginRegisterStore>((set) => ({
    showLogin: false,
    showRegister: false,
    showLogout: false,
    setShowLogin: (showLogin: boolean) => set(() => ({ showLogin: showLogin })),
    setShowRegister: (showRegister: boolean) => set(() => ({ showRegister: showRegister })),
    setShowLogout: (showLogout: boolean) => set(() => ({ showLogout: showLogout })),
}))
