import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import React from 'react'

const DasboardPage = () => {
    return (
        <div>
            <nav className="flex justify-between items-center px-4 my-2">
                <ul className="text-5xl font-bold text-gray-500">Dashboard</ul>
                <ul>
                    <Button variant={'default'} onClick={() => signOut({ callbackUrl: '/auth/signin' })} className="bg-red-600 text-white cursor-pointer">
                        Sign out
                    </Button>
                </ul>
            </nav>
        </div>
    )
}

export default DasboardPage