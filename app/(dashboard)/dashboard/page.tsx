"use client";

import Spinner from '@/components/Spinner';
import { useDashboardStore } from '@/lib/store/dashboardStore';
import { useUserStore } from '@/lib/store/userStore';
import React, { useEffect } from 'react';

interface DashboardData {
    tasks: number;
    notes: number;
    events: number;
}

const DasboardPage = () => {
    const user = useUserStore((s) => s.user);
    const { summary, loading, fetchSummary } = useDashboardStore();

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);


    return (
        <>
            {user && (
                <div>
                    <h1 className="text-4xl font-semibold">
                        Welcome back, <br /> {user?.name}
                    </h1>

                    <div className="pt-12">
                        {loading ? (
                            <Spinner color="text-blue-600" size="h-8 w-8" />
                        ) : (
                            <ul className='flex justify-between items-center'>
                                <li>
                                    {(summary?.tasks ?? 0) % 2 === 0 ? `${summary?.tasks} Tasks` : `${summary?.tasks} Task`}
                                </li>
                                <li>
                                    {(summary?.notes ?? 0) % 2 === 0 ? `${summary?.notes} Notes` : `${summary?.notes} Note`}
                                </li>
                                <li>
                                    {(summary?.events ?? 0) % 2 === 0 ? `${summary?.events} Events` : `${summary?.events} Event`}
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default DasboardPage;