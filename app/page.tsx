"use client"

import React from 'react';
import { useUserStore } from '@/lib/store/userStore';
import Navbar from '@/components/Navbar';
import SignIn from './auth/signin/page';
import DashboardPage from './auth/dashboard/page';

const Home = () => {
  const user = useUserStore((s) => s.user);

  return (
    <div>
      {user ? (
        <>
          <Navbar />
          <DashboardPage />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  )
}

export default Home