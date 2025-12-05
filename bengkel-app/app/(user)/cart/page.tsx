"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingCart, DollarSign, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation"; // ⬅️ Tambahan untuk redirect

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image_url: string;
  isSelected: boolean;
}

const dummyCart: CartItem[] = [
  {
    id: 101,
    name: "Oli Mesin Matic Premium (1L)",
    price: 65000,
    qty: 2,
    image_url: "https://placehold.co/100x100/234C6A/FFFFFF?text=Oli",
    isSelected: true,
  },
  {
    id: 102,
    name: "Filter Udara Kualitas Tinggi",
    price: 85000,
    qty: 1,
    image_url: "https://placehold.co/100x100/FF6D1F/FFFFFF?text=Filter",
    isSelected: false,
  },
  {
    id: 103,
    name: "Busi Iridium Motor (Set 2)",
    price: 120000,
    qty: 1,
    image_url: "https://placehold.co/100x100/234C6A/FFFFFF?text=Busi",
    isSelected: true,
  },
];

export default function CartPage() {
  const router = useRouter(); // ⬅️ Untuk redirect ke halaman checkout
  const [cart, setCart] = useState<CartItem[]>([]);

  const updateCartAndStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    let initialCart: CartItem[] = [];

    if (saved) {
      initialCart = JSON.parse(saved).map((item: any) => ({
        ...item,
        isSelected: item.isSelected !== undefined ? item.isSelected : true,
      }));
    } else {
      initialCart = dummyCart;
    }

    updateCartAndStorage(initialCart);
  }, []);

  const toggleItemSelection = (id: number) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, isSelected: !item.isSelected } : item
    );
    updateCartAndStorage(updated);
  };

  const toggleSelectAll = (checked: boolean) => {
    const updated = cart.map((item) => ({ ...item, isSelected: checked }));
    updateCartAndStorage(updated);
  };

  const decreaseQty = (id: number) => {
    const updated = cart.map((item) =>
      item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
    );
    updateCartAndStorage(updated);
  };

  const increaseQty = (id: number) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    updateCartAndStorage(updated);
  };

  const removeItem = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    updateCartAndStorage(updated);
  };

  const totalSelected = cart.reduce(
    (sum, item) => (item.isSelected ? sum + item.price * item.qty : sum),
    0
  );

  const allSelected = cart.length > 0 && cart.every((item) => item.isSelected);
  const selectedCount = cart.filter((item) => item.isSelected).length;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-8 border-b pb-3">
            <ShoppingCart size={32} className="text-[#FF6D1F]" />
            <h1 className="text-3xl font-extrabold text-[#234C6A]">Keranjang Belanja Anda</h1>
            <span className="text-xl text-gray-500 ml-auto">({cart.length} Item)</span>
          </div>

          {cart.length > 0 && (
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow mb-6 border border-gray-200">
              <input
                type="checkbox"
                id="selectAll"
                checked={allSelected}
                onChange={(e) => toggleSelectAll(e.target.checked)}
                className="w-5 h-5 text-[#234C6A] bg-gray-100 border-gray-300 rounded focus:ring-[#FF6D1F]"
              />
              <label htmlFor="selectAll" className="font-bold text-gray-700 cursor-pointer">
                Pilih Semua ({cart.length} Item)
              </label>
              <span className="text-sm text-gray-500 ml-auto">
                Terpilih: {selectedCount} item
              </span>
            </div>
          )}

          {cart.length === 0 && (
            <div className="text-center bg-white p-12 rounded-xl shadow-md border border-gray-200">
              <ShoppingCart size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">Keranjang Anda masih kosong.</p>
            </div>
          )}

          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-lg border-l-4 
                  ${item.isSelected ? "border-[#FF6D1F]" : "border-gray-200"}`}
              >
                <div className="flex items-center pr-2">
                  <input
                    type="checkbox"
                    checked={item.isSelected ?? false}
                    onChange={() => toggleItemSelection(item.id)}
                    className="w-5 h-5 text-[#234C6A] cursor-pointer"
                  />
                </div>

                <img
                  src={item.image_url}
                  className="w-full sm:w-28 h-28 object-cover rounded-lg border"
                  alt={item.name}
                />

                <div className="flex grow justify-between">
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <h2 className="text-lg font-bold text-[#234C6A]">{item.name}</h2>
                      <p className="text-xl font-extrabold text-[#FF6D1F]">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="text-sm text-gray-500">
                      Subtotal:{" "}
                      <span className="font-semibold">
                        Rp {(item.price * item.qty).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between py-1">
                    <div className="flex items-center border rounded-full bg-gray-50">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        disabled={item.qty === 1}
                        className="p-2 text-[#234C6A] disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="px-3 text-lg font-bold">{item.qty}</span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="p-2 text-[#234C6A]"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 mt-2 text-sm"
                    >
                      <Trash2 size={18} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="w-full md:sticky md:top-6 h-fit">
            <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-[#234C6A]">
              <h2 className="text-2xl font-bold text-[#234C6A] mb-5 border-b pb-3 flex items-center gap-2">
                <DollarSign size={24} className="text-[#FF6D1F]" /> Rincian Pembayaran
              </h2>

              <div className="space-y-3 mb-6 text-gray-700">
                <div className="flex justify-between">
                  <span>Total Harga Produk ({selectedCount} item)</span>
                  <span>Rp {totalSelected.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex justify-between">
                  <span>Diskon</span>
                  <span>Rp 0</span>
                </div>

                <div className="flex justify-between">
                  <span>Biaya Pengiriman</span>
                  <span>Rp 0</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-extrabold">
                <span className="text-[#234C6A]">TOTAL BAYAR</span>
                <span className="text-[#FF6D1F]">
                  Rp {totalSelected.toLocaleString("id-ID")}
                </span>
              </div>

              {/*  ⬇️ Tombol menuju halaman CHECKOUT  */}
              <button
                disabled={selectedCount === 0}
                onClick={() => {
                  // Simpan item terpilih ke storage (opsional tapi berguna)
                  const selectedItems = cart.filter((i) => i.isSelected);
                  localStorage.setItem("checkout_items", JSON.stringify(selectedItems));

                  router.push("/checkout"); // ⬅️ langsung lempar ke halaman checkout
                }}
                className="block w-full text-center bg-[#FF6D1F] hover:bg-[#E05B1B] 
                text-white font-bold py-3 rounded-full mt-6 transition duration-300 shadow-lg disabled:bg-gray-400"
              >
                Lanjutkan ke Checkout ({selectedCount} Item)
              </button>

              {selectedCount === 0 && (
                <p className="text-red-500 text-sm mt-2 text-center flex items-center justify-center gap-1">
                  <CheckCircle size={14} /> Pilih minimal 1 item untuk checkout.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
