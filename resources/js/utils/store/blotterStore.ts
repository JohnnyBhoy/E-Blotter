import { create } from "zustand";

type BlotterStore = {
    page: number,
    perPage: number,
    blotter: number,
    hearing: number,
    settled: number,
    pending: number,
    referred: number,
    setPage: (page: number) => void,
    setPerPage: (perPage: number) => void,
    setBlotter: (blotter: number) => void,
    setHearing: (hearing: number) => void,
    setSettled: (settled: number) => void,
    setPending: (pending: number) => void,
    setReferred: (referred: number) => void,
}

export const useBlotterStore = create<BlotterStore>((set) => ({
    page: 1,
    perPage: 10,
    blotter: 0,
    hearing: 0,
    settled: 0,
    pending: 0,
    referred: 0,
    setPage: (page: number) => set(() => ({ page: page })),
    setPerPage: (perPage: number) => set(() => ({ perPage: perPage })),
    setBlotter: (blotter: number) => set(() => ({ blotter: blotter })),
    setHearing: (hearing: number) => set(() => ({ hearing: hearing })),
    setSettled: (settled: number) => set(() => ({ settled: settled })),
    setPending: (pending: number) => set(() => ({ pending: pending })),
    setReferred: (referred: number) => set(() => ({ referred: referred })),
}))
