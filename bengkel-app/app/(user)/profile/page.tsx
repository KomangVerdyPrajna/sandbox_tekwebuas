"use client";

import { useState } from "react";
import { User, Mail, Phone, Pencil, LogOut, Camera } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Pengguna Baru",
    email: "user@example.com",
    phone: "08xxxxxxxxxx",
  });

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    setUser(formData);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      {/* CARD PROFILE */}
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

        {/* PROFILE TOP */}
        <div className="flex flex-col md:flex-row items-center gap-6">

          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-[#234C6A] text-white flex items-center justify-center text-4xl font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-1 right-1 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition">
              <Camera size={18} />
            </button>
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#234C6A]">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phone}</p>
          </div>
        </div>

        <hr className="my-6" />

        {/* FORM INPUT */}
        <div className="space-y-5">
          {[
            { label: "Nama", icon: User, key: "name", type: "text" },
            { label: "Email", icon: Mail, key: "email", type: "email" },
            { label: "No Telepon", icon: Phone, key: "phone", type: "text" },
          ].map((item: any) => (
            <div key={item.key}>
              <label className="text-gray-700 font-medium flex items-center gap-2 mb-1">
                <item.icon size={18} /> {item.label}
              </label>

              <input
                type={item.type}
                disabled={!editing}
                className={`w-full p-3 rounded-xl border transition ${
                  editing
                    ? "border-[#FF6D1F] bg-white"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
                value={(formData as any)[item.key]}
                onChange={(e) =>
                  setFormData({ ...formData, [item.key]: e.target.value })
                }
              />
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex gap-4 justify-center md:justify-start flex-wrap">

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 bg-[#FF6D1F] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition shadow"
            >
              <Pencil size={20} /> Edit Profil
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#FF6D1F] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition shadow"
            >
              Simpan Perubahan
            </button>
          )}

          <button className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold px-6 py-3 transition">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
