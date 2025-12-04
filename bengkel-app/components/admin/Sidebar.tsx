"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  Users,
  Settings
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Produk", href: "/admin/produk", icon: Package },
    { name: "Booking", href: "/admin/bookingAdmin", icon: CalendarCheck },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="p-5 flex flex-col h-full bg-[#234C6A] text-white">

      {/* MENU LIST */}
      <ul className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${active ? "bg-white text-[#234C6A] shadow-md" : "hover:bg-white/20"}
              `}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>

     

    </div>
  );
}
