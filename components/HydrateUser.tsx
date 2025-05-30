'use client'

import { Session } from 'next-auth'
import { useEffect } from 'react'
import { useUserStore } from '@/lib/store/userStore'

export default function HydrateUser({ session }: { session: Session | null }) {
    const setUser = useUserStore((state) => state.setUser)

    useEffect(() => {
        if (session?.user?.email && (session.user as { id: string }).id) {
            const userWithId = session.user as { id: string; name?: string; email: string };
            setUser({
                id: userWithId.id,
                name: userWithId.name,
                email: userWithId.email
            })
        }
    }, [session, setUser])

    return null
}
