'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/lib/store/userStore';

const SessionSync = () => {
    const { data: session, status } = useSession();
    const setUser = useUserStore((s) => s.setUser);
    const clearUser = useUserStore((s) => s.clearUser);

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setUser({
                id: session.user.id,
                name: session.user.name || '',
                email: session.user.email || '',
            });
        } else if (status === 'unauthenticated') {
            clearUser();
        }
    }, [session, status, setUser, clearUser]);

    return null;
}

export default SessionSync;