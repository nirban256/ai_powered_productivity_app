"use client"

import Sidebar from "@/components/Sidebar";
import Spinner from "@/components/Spinner";
import Topbar from "@/components/Topbar";
import { useDashboardStore } from "@/lib/store/dashboardStore";
import { useUserStore } from "@/lib/store/userStore";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useUserStore((s) => s.user);
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    // Waiting for zustand to hydrate before checking user
    if (!hasHydrated) {
        return <Spinner />; // or a spinner
    }

    if (!user) {
        redirect("/auth/signin");
    }

    return (
        <div className="">
            <Topbar />
            <div className="flex max-w-screen">
                <Sidebar />
                <main className="p-4 flex-1">{children}</main>
            </div>
        </div>
    );
}
