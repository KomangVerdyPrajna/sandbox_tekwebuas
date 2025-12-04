"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";

export default function AdminNavbar() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <nav className="h-16 flex items-center justify-between bg-white px-6 shadow-sm rounded-md">

    

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Notification Icon */}
        <button className="relative hover:bg-gray-100 p-2 rounded-full">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-[#FF6D1F] text-white flex items-center justify-center font-semibold">
            A
          </div>
          <span className="hidden md:block font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </nav>
  );
}
