"use client"

import React from 'react';
import { useUserStore } from '@/lib/store/userStore';
import SignIn from './auth/signin/page';
import DashboardPage from './(dashboard)/dashboard/page';

const Home = () => {
  const user = useUserStore((s) => s.user);

  return (
    <div>
      {!user ? (
        <>
          <DashboardPage />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  )
}

export default Home