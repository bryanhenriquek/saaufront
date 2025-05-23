'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast'
import "../globals.css";

import NaviBar from "@/components/Navibar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="bg-[#f1f5f9] min-h-screen">
      <NaviBar />
      <div
        style={{
          marginLeft: "220px",
          padding: "1rem",
          boxSizing: "border-box",
        }}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.9rem',
            },
          }}
        />
      </div>
    </div>
  );
}
