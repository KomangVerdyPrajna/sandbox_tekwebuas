// app/cashier/layout.tsx
'use client'; // WAJIB: Menggunakan useRouter memerlukan komponen Client

import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation'; // Import useRouter dari next/navigation untuk App Router

interface CashierLayoutProps {
    children: ReactNode;
}

const CashierLayout: React.FC<CashierLayoutProps> = ({ children }) => {
    const router = useRouter();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        
        // --- LOGIKA LOGOUT DI SINI ---
        // 1. (Opsional) Panggil API Laravel untuk invalidate token
        // 2. Hapus cookie otentikasi (auth_token)
        
        // 3. Arahkan pengguna ke halaman login
        router.push('/auth/login');
    };

    return (
        <>
            <Head>
                <title>Sistem POS & Kasir | Bengkel Anda</title>
                <meta name="description" content="Halaman Point of Sale (POS) untuk transaksi cepat." />
            </Head>
            
            {/* Container utama, pastikan layout full screen untuk kasir */}
            <div className="min-h-screen bg-gray-50">
                
                {/* Header minimalis untuk Kasir */}
                <header className="w-full bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-indigo-700">POS Transaksi Cepat</h1>
                    <div className="text-sm text-gray-600">
                        {/* Informasi kasir yang sedang bertugas */}
                        <span>Kasir: John Doe</span> | 
                        <button 
                            onClick={handleLogout} // Tambahkan handler onClick
                            className="ml-2 text-red-500 hover:text-red-700 transition duration-150"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Konten Halaman Kasir */}
                <main className="p-4">
                    {children}
                </main>
            </div>
        </>
    );
};

export default CashierLayout;