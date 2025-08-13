import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionSync from "@/components/SessionSync";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aether - AI Powered Productivity App",
  description: "Aether is an AI-powered productivity app designed to enhance your workflow and boost your efficiency.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white `}
      >
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute -top-1/4 -left-1/4 w-96 h-96 md:w-[500px] md:h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 md:w-[500px] md:h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 md:w-[500px] md:h-[500px] bg-green-600 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <main className="relative z-10 h-full">
          <Providers>
            <SessionSync />
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: '',
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            {children}
          </Providers>
        </main>
      </body>
    </html>
  );
}
