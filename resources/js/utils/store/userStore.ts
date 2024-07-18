import { create } from "zustand";

type UserStore = {
    barangay: string,
    city: string,
    province: string,
    region: string,
    showLoginSuccess: boolean,
    setShowLoginSuccess: (showLoginSuccess: boolean) => void,
    setBarangay: (barangay: string) => void,
    setCity: (city: string) => void,
    setProvince: (province: string) => void,
    setRegion: (region: string) => void,
}

export const useUserStore = create<UserStore>((set) => ({
    barangay: '',
    city: '',
    province: '',
    region: '',
    showLoginSuccess: false,
    setShowLoginSuccess: (showLoginSuccess: boolean) => set(() => ({ showLoginSuccess: showLoginSuccess })),
    setBarangay: (barangay: string) => set(() => ({ barangay: barangay })),
    setCity: (city: string) => set(() => ({ city: city })),
    setProvince: (province: string) => set(() => ({ province: province })),
    setRegion: (region: string) => set(() => ({ region: region })),
}))
