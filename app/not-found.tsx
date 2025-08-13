"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, Frown } from 'lucide-react';
import toast from 'react-hot-toast';

const ErrorPage = () => {
    const router = useRouter();

    const goHome = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setTimeout(() => {
            router.push('/');
        }, 3000);
        toast.success("Redirecting you to home!");
    };

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center text-center p-4">
            <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center justify-center mb-8 space-x-4">
                    <Frown size={120} strokeWidth={1.5} className="text-red-500" />
                    <h1 className="text-8xl sm:text-9xl font-black text-gray-100 tracking-tighter">
                        Oops!
                    </h1>
                </div>

                <h2 className="text-2xl sm:text-4xl font-bold text-gray-200 mb-2">
                    Page Not Found.
                </h2>

                <p className="max-w-md text-gray-400 mb-8">
                    The page you're looking for doesn't exist or is temporarily unavailable. Let's get you back on track.
                </p>

                <button
                    onClick={goHome}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-8 rounded-lg flex items-center space-x-2 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 cursor-pointer"
                >
                    <Home size={18} />
                    <span>Go to Dashboard</span>
                </button>
            </div>
        </div>
    )
}

export default ErrorPage;