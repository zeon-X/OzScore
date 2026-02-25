import { create } from "zustand";
import { MatchStatus } from "../types/query";

interface FilterState {
    status?: MatchStatus;
    todate?: string;
    tournamentIds: number[];

    setStatus: (status?: MatchStatus) => void;
    setToDate: (date?: string) => void;
    toggleTournament: (id: number) => void;
    resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    status: "all",
    todate: undefined,
    tournamentIds: [],

    setStatus: (status) => set({ status }),

    setToDate: (todate) => set({ todate }),

    toggleTournament: (id) =>
        set((state) => ({
            tournamentIds: state.tournamentIds.includes(id)
                ? state.tournamentIds.filter((t) => t !== id)
                : [...state.tournamentIds, id],
        })),

    resetFilters: () =>
        set({
            status: "all",
            todate: undefined,
            tournamentIds: [],
        }),
}));