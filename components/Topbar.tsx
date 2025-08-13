import React from 'react'
import { Button } from './ui/button'
import { signOut } from 'next-auth/react'
import { useUserStore } from '@/lib/store/userStore'

const Topbar = () => {
    const user = useUserStore(s => s.user);

    return (
        <header className="w-full shadow p-4">
            <nav>
                <ul className="flex justify-between items-center">
                    <li>
                        <h1 className="text-5xl font-bold text-slate-600">Aether</h1>
                    </li>
                    <li className='flex justify-center items-center font-bold text-lg text-gray-600'>
                        Hello
                        <span className='text-blue-500 mx-1.5 mr-4'>
                            {user?.name}
                        </span>
                        <Button variant={'default'} onClick={() => signOut({ callbackUrl: '/auth/signin' })} className="bg-red-600 text-white cursor-pointer">
                            Sign out
                        </Button>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Topbar