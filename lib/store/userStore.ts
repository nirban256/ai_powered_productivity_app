import { create } from "zustand";
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
}

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: 'user-store', // localStorage key
        }
    )
);

export { useUserStore };