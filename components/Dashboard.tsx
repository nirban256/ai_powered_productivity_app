'use client'

import { signOut } from 'next-auth/react';
import { Button } from './ui/button';

const Dashboard = () => {
    return (
        <Button variant={'destructive'} onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
            Sign out
        </Button>
    )
}

export default Dashboard