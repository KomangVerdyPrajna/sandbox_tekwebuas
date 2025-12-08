"use client";

import { useState } from "react";

const EyeIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a1.8 1.8 0 0 1 .32-.69M14.93 11.23a3 3 0 1 1-3.6-3.6M12 9a3 3 0 0 0-3 3M1 1l22 22"/></svg>;

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Gagal login.");
                return;
            }

            // === FIX PENTING ===
            // Simpan token ke COOKIE
            document.cookie = `token=${data.token}; path=/; SameSite=Lax;`;

            // Simpan user ke COOKIE
            document.cookie = `user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; SameSite=Lax;`;

            // Tentukan routing berdasarkan role
            let redirectPath = "/admin/dashboard";

            if (data.user.role === "customer") {
                redirectPath = "/profile";
            }

            // Redirect paksa
            window.location.assign(redirectPath);

        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan, pastikan server Laravel berjalan.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">Masuk ke Sistem</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 mb-4 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-5">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2 border rounded-lg pr-10"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-2"
                            >
                                {showPassword ? (
                                    <EyeOffIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
                        Masuk
                    </button>
                </form>
            </div>
        </div>
    );
}
