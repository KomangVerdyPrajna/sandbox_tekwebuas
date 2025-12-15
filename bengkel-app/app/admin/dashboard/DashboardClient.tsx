"use client";

import { useEffect, useState } from "react";

export default function DashboardClient() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // AMAN: hanya jalan di browser
    const cookies = document.cookie;
    setToken(cookies);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <p>Token: {token}</p>
    </div>
  );
}
