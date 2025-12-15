import { Suspense } from "react";
import EditProductClient from "./editproductclient";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Memuat halaman...</p>}>
      <EditProductClient />
    </Suspense>
  );
}
