"use client";

import { useState, useEffect, useRef } from "react";
import { User, Mail, Pencil, LogOut, Camera, Save, XCircle, ShieldCheck, ShoppingCart } from "lucide-react";

interface UserData {
    id?: number;
    name: string;
    email: string;
    role?: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<UserData>({ name: "", email: "" });
    const [loading, setLoading] = useState(true);

    // ================================
    //    FETCH USER DARI BACKEND
    // ================================
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/auth/login"; 
            return;
        }

        fetch("http://localhost:8000/api/user", {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        })
        .then(async res => {
            if (res.status === 401) {
                localStorage.clear();
                window.location.href = "/auth/login";
            }
            return res.json();
        })
        .then(data => {
            setUser(data.user);
            setFormData(data.user);
        })
        .finally(() => setLoading(false));
    }, []);

    // ================================
    //     SIMPAN EDIT LOKAL
    // ================================
    const handleSave = () => {
        setUser(formData);
        localStorage.setItem("profileUser", JSON.stringify(formData));
        alert("Profil berhasil diperbarui (local only)!");
        setEditing(false);
    };

    const handleLogout = () => {
        localStorage.clear();
        alert("Logout berhasil!");
        window.location.href = "/auth/login";
    };

    if (loading) return <p className="text-center py-20 text-lg">Memuat profil...</p>;
    if (!user) return <p className="text-center text-red-500 py-20">User tidak ditemukan</p>;

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center py-8 px-4">
            <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 border-t-8 border-[#234C6A]">

                {/* ===================== HEADER ===================== */}
                <div className="flex flex-col items-center border-b pb-6 mb-6">

                    {/* Avatar */}
                    <div className="relative mb-4">
                        <div className="w-28 h-28 rounded-full bg-[#FF6D1F] flex items-center justify-center 
                        text-white text-5xl font-extrabold shadow-lg ring-4 ring-orange-400/50">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <button className="absolute bottom-0 right-2 bg-white p-2 rounded-full shadow-md border">
                            <Camera size={18}/>
                        </button>
                    </div>

                    <h2 className="text-3xl font-extrabold text-[#234C6A]">{user.name}</h2>

                    {/* Badge Verified */}
                    <div className="mt-2 px-3 py-1 bg-green-100 text-green-600 rounded-full flex items-center gap-2 text-sm font-medium">
                        <ShieldCheck size={16}/> Akun Terverifikasi
                    </div>
                </div>

                {/* ===================== DETAIL AKUN ===================== */}
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#234C6A]">
                    <Pencil size={20}/> Detail Akun {editing && <span className="text-sm text-red-500">(Editing)</span>}
                </h3>

                {["name","email"].map((field) => (
                    <div key={field} className="mb-4">
                        <label className="font-medium text-gray-700 text-sm">
                            {field === "name" ? "Nama Lengkap" : "Email"}
                        </label>
                        <input 
                            type="text"
                            disabled={!editing}
                            className={`p-3 rounded-xl border w-full text-gray-800 mt-1
                            ${editing ? "border-[#FF6D1F] ring-2 ring-orange-200" : "border-gray-300 bg-gray-100 cursor-default"}`}
                            value={(formData as any)[field]}
                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        />
                    </div>
                ))}

                {/* ===================== BUTTON AKSI ===================== */}
                <div className="flex flex-col gap-4 mt-6 border-t pt-6">

                    {!editing ? (
                        <button 
                            onClick={() => setEditing(true)} 
                            className="bg-gray-200 hover:bg-gray-300 py-3 rounded-xl font-semibold shadow"
                        >
                            Edit Profil
                        </button>
                    ) : (
                        <>
                            <button 
                                onClick={handleSave} 
                                className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
                            >
                                <Save size={18}/> Simpan Perubahan
                            </button>
                            <button 
                                onClick={() => setEditing(false)} 
                                className="border border-red-400 text-red-600 hover:bg-red-50 py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
                            >
                                <XCircle size={18}/> Batal
                            </button>
                        </>
                    )}

                    {/* Logout */}
                    <button 
                        onClick={handleLogout} 
                        className="text-gray-600 hover:text-red-600 flex justify-center items-center gap-2 py-3"
                    >
                        <LogOut size={18}/> Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
