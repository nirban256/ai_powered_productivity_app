import toast from "react-hot-toast";
import { create } from "zustand";

type Task = {
    id: string;
    title: string;
    status: boolean;
    priority: string;
    createdAt: Date;
};

type Note = {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
};

type Event = {
    id: string;
    title: string;
    date: Date;
    createdAt: Date;
};

type DashboardSummary = {
    taskLength: number;
    noteLength: number;
    eventLength: number;
    tasks: Task[];
    notes: Note[];
    events: Event[];

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
            toast.success("Fetched the user data");
        } catch (error) {
            console.error("Dashboard fetch error:", error);
            toast.error("Error fetching user data");
            set({ loading: false });
        }
    },
}));
