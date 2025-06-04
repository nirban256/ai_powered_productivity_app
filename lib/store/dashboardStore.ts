import { create } from "zustand";

const useDashboardStore = create()(
    (set) => ({
        summary: null,
        loading: false,
        fetchSummary: async () => {
            set({ loading: true });
            const res = await fetch("/api/dashboard/summary");
            const data = await res.json();
            set({
                summary: data,
                loading: false
            })
        }
    })
);

export { useDashboardStore };