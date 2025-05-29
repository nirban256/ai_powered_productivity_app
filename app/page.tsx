"use client"

import React from 'react';
import { useUserStore } from '@/lib/store/userStore';
import Dashboard from '@/components/Dashboard';
import Navbar from '@/components/Navbar';
import SignIn from './auth/signin/page';

const Home = () => {
  const user = useUserStore((s) => s.user);

  return (
    <div>
      <Navbar />
      {user ? (
        <Dashboard />
      ) : (
        <SignIn />
      )}
    </div>
  )
}

export default Home