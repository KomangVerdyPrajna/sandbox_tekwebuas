import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export default function Page() {
  return (
    <Suspense
      fallback={<p className="text-center mt-10">Memuat dashboard...</p>}
    >
      <DashboardClient />
    </Suspense>
  );
}
