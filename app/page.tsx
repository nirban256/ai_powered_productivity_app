"use client"

import React from 'react';
import { useUserStore } from '@/lib/store/userStore';
import SignIn from './auth/signin/page';
import DashboardLayout from './(dashboard)/layout';
import DasboardPage from './(dashboard)/dashboard/page';

const Home = () => {
  const user = useUserStore((s) => s.user);

  return (
    <div>
      {user ? (
        <>
          <DashboardLayout children={<DasboardPage />} />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  )
}

export default Home