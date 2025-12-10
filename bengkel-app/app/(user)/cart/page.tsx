"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    img_url: string; // path relatif atau full URL
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof document !== "undefined"
      ? document.cookie.match(/token=([^;]+)/)?.[1]
      : null;

  // Animasi qty
  const [animateId, setAnimateId] = useState<number | null>(null);
  const playAnim = (id: number) => {
    setAnimateId(id);
    setTimeout(() => setAnimateId(null), 200);
  };

  // Fetch cart
  const fetchCart = async () => {
    if (!token) return router.push("/login");

    try {
      const res = await fetch("http://localhost:8000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setCart(data.cart_items ?? []);
    } catch (err) {
      console.error("Error fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity
  const updateQty = async (id: number, qty: number) => {
    if (qty < 1) return;

    playAnim(id);
    const product_id = cart.find(c => c.id === id)?.product.id;
    if (!product_id) return;

    await fetch(`http://localhost:8000/api/carts/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id, quantity: qty }),
    });

    fetchCart();
  };

  // Remove item
  const removeItem = async (id: number) => {
    await fetch(`http://localhost:8000/api/carts/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    fetchCart();
  };

  // Total
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) return <p className="text-center mt-10">Memuat keranjang...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-10 border-b pb-4">
          <ShoppingCart size={34} className="text-[#FF6D1F]" />
          <h1 className="text-3xl font-extrabold text-[#234C6A] tracking-wide">Keranjang Belanja</h1>
          <span className="ml-auto text-gray-500 text-sm">({cart.length} item)</span>
        </div>

        {/* Jika kosong */}
        {cart.length === 0 && (
          <div className="text-center bg-white p-10 rounded-xl shadow">
            <p className="text-gray-600 mb-4 text-lg">Keranjang masih kosong</p>
            <button
              onClick={() => router.push("/marketplace")}
              className="bg-[#FF6D1F] px-6 py-2 rounded-full text-white font-bold hover:bg-[#e65b14] transition"
            >
              Belanja Sekarang
            </button>
          </div>
        )}

        {/* ITEM LIST */}
        <div className="space-y-5">
          {cart.map(item => {
            // Fix gambar: cek apakah img_url full URL atau relative
            const imgSrc = item.product.img_url.startsWith("http")
              ? item.product.img_url
              : `http://localhost:8000/storage/${item.product.img_url}`;

            return (
              <div key={item.id}
                className="flex bg-white p-5 rounded-xl shadow-md gap-6 items-center border hover:shadow-xl hover:-translate-y-0.5 transition duration-200"
              >

                {/* Gambar Produk */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center border">
                  <img
                    src={imgSrc}
                    className="object-cover w-full h-full"
                    onError={(e) => e.currentTarget.src = "/no-image.png"}
                  />
                </div>

                {/* Detail */}
                <div className="flex flex-col flex-1">
                  <h2 className="font-semibold text-[19px] text-[#234C6A] leading-tight">
                    {item.product.name}
                  </h2>
                  <p className="text-[#FF6D1F] font-bold text-[17px] mt-1">
                    Rp {item.product.price.toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Qty Control */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 active:scale-95 transition"
                  >
                    <Minus size={18} className="text-[#234C6A]" />
                  </button>

                  <span
                    className={`font-semibold text-[18px] w-6 text-center text-[#234C6A] transition-all duration-200
                      ${animateId === item.id ? "scale-125 opacity-90" : "scale-100 opacity-100"}`}
                  >
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 active:scale-95 transition"
                  >
                    <Plus size={18} className="text-[#234C6A]" />
                  </button>
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <Trash2 size={22} />
                </button>

              </div>
            );
          })}
        </div>

        {/* SUMMARY */}
        {cart.length > 0 && (
          <div className="mt-10 bg-white p-6 rounded-xl shadow flex justify-between items-center border">
            <p className="text-xl font-bold text-[#234C6A]">
              Total : <span className="text-[#FF6D1F]">Rp {total.toLocaleString('id-ID')}</span>
            </p>

            <button
              onClick={() => router.push("/checkout")}
              className="bg-[#FF6D1F] text-white px-7 py-3 rounded-full font-bold text-lg hover:bg-[#e65b14] transition"
            >
              Checkout
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
