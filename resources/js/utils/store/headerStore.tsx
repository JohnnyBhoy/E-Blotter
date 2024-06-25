import { create } from "zustand";

type HeaderStore = {
    activeTab: string,
    setActiveTab: (activeTab: string) => void
}

export const useHeaderStore = create<HeaderStore>((set) => ({
    activeTab: 'Overview',
    setActiveTab: (activeTab: string) => set(() => ({ activeTab: activeTab })),
}))
