"use client"

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useUserStore } from "@/lib/store/userStore";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = useUserStore((s) => s.user);

    if (!session) {
        redirect("/signin");
    }

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Topbar />
                <main className="p-4 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
