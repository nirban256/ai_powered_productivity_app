"use client";

import { useUserStore } from '@/lib/store/userStore';
import React from 'react';

const DasboardPage = () => {
    const user = useUserStore((s) => s.user);

    return (
        <div>
            <h1 className="text-4xl font-semibold">
                Welcome back, <br /> {user?.name}
            </h1>

            <div className="my-10">
                hwllo
            </div>
        </div>
    )
}

export default DasboardPage