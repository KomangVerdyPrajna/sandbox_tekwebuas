"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  alertSuccess,
  alertError,
} from "@/components/Alert";

const DEFAULT_IMAGE_URL = "/no-image.png";
const BACKEND_BASE = "http://localhost:8000";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  img_url: string[];
  jenis_barang: string;
  stock: number;
}

const productTypes = ["Sparepart", "Aksesoris"];

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function buildImageUrl(pathOrUrl?: string | null) {
  if (!pathOrUrl) return DEFAULT_IMAGE_URL;
  if (pathOrUrl.startsWith("http")) return pathOrUrl;

  const cleaned = pathOrUrl.replace(/^\/+/, "");
  if (cleaned.startsWith("storage/")) {
    return `${BACKEND_BASE}/${cleaned}`;
  }
  return `${BACKEND_BASE}/images/${cleaned}`;
}

export default function EditProductClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  // FETCH DATA
  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const token = getCookie("token");
    if (!token) {
      alertError("Sesi berakhir. Silakan login ulang.");
      router.push("/auth/login");
      return;
    }

    async function fetchProduct() {
      try {
        const res = await fetch(
          `${BACKEND_BASE}/api/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          alertError("Gagal memuat produk.");
          router.push("/admin/produk");
          return;
        }

        const data = await res.json();
        setProduct(data.product);
        setExistingImageUrls(data.product.img_url || []);
      } catch {
        alertError("Tidak dapat terhubung ke server.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId, router]);

  // IMAGE PREVIEW
  const newPreviewUrls = useMemo(
    () => selectedImageFiles.map((f) => URL.createObjectURL(f)),
    [selectedImageFiles]
  );

  useEffect(() => {
    return () => {
      newPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [newPreviewUrls]);

  const previewUrls =
    newPreviewUrls.length > 0 ? newPreviewUrls : existingImageUrls;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!product) return;
    const name = e.target.name;
    let value: any = e.target.value;
    if (name === "price" || name === "stock") value = Number(value);
    setProduct({ ...product, [name]: value });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const combined = [...selectedImageFiles, ...files].slice(0, 5);
    setSelectedImageFiles(combined);
    e.target.value = "";
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsUpdating(true);
    const token = getCookie("token");
    if (!token) {
      alertError("Sesi berakhir.");
      router.push("/auth/login");
      return;
    }

    const form = new FormData();
    form.append("name", product.name);
    form.append("price", product.price.toString());
    form.append("description", product.description);
    form.append("jenis_barang", product.jenis_barang);
    form.append("stock", product.stock.toString());
    form.append("_method", "PUT");

    selectedImageFiles.forEach((f) => form.append("images[]", f));

    try {
      const res = await fetch(
        `${BACKEND_BASE}/api/products/${product.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: form,
        }
      );

      if (!res.ok) {
        alertError("Gagal update produk.");
        return;
      }

      alertSuccess("Produk berhasil diperbarui!");
      router.push("/admin/produk");
    } catch {
      alertError("Tidak dapat terhubung ke server.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Memuat...</p>;
  if (!product)
    return <p className="text-center text-red-500">Produk tidak ditemukan</p>;

  return (
    <div className="max-w-2xl mx-auto p-5 bg-white shadow rounded-xl mt-6">
      <h1 className="text-xl font-bold mb-4 text-center">
        Edit Produk: {product.name}
      </h1>

      <form onSubmit={updateProduct} className="space-y-3">
        <input name="name" value={product.name} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="price" type="number" value={product.price} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="stock" type="number" value={product.stock} onChange={handleChange} className="w-full border p-2 rounded" />

        <select name="jenis_barang" value={product.jenis_barang} onChange={handleChange} className="w-full border p-2 rounded">
          {productTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <textarea name="description" value={product.description} onChange={handleChange} className="w-full border p-2 rounded" />

        <input type="file" multiple accept="image/*" onChange={handleUpload} />

        <div className="flex gap-2">
          {previewUrls.map((u, i) => (
            <Image key={i} src={buildImageUrl(u)} alt="preview" width={80} height={80} unoptimized />
          ))}
        </div>

        <button disabled={isUpdating} className="w-full bg-blue-600 text-white p-2 rounded">
          {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
