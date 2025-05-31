import React from 'react'
import { Button } from './ui/button'
import { signOut } from 'next-auth/react'

const Navbar = () => {
    return (
        <div className='flex justify-between items-center'>
            <h1>Aether</h1>
            <Button variant={'destructive'} onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
                Sign out
            </Button>
        </div>
    )
}

export default Navbar