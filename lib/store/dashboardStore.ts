import { create } from "zustand";

type DashboardSummary = {
    tasks: number;
    notes: number;
    events: number;
};

type DashboardStore = {
    summary: DashboardSummary | null;
    loading: boolean;
    fetchSummary: () => Promise<void>;
};

export const useDashboardStore = create<DashboardStore>()((set) => ({
    summary: null,
    loading: false,
    fetchSummary: async () => {
        try {
            set({ loading: true });
            const res = await fetch("/api/dashboard");
            if (!res.ok) throw new Error("Failed to fetch dashboard data");
            const data = await res.json();
            set({ summary: data, loading: false });
        } catch (error) {
            console.error("Dashboard fetch error:", error);
            set({ loading: false });
        }
    },
}));
