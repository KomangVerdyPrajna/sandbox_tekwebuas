"use client";

import { useEffect, useState } from "react";
import { MapPin, Phone, User, CreditCard, Truck, ShoppingBag, Send } from "lucide-react";

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: {
        name: string;
        price: number;
        image_url?: string;
    };
}

// ===== TOKEN FROM COOKIE (SANCTUM) =====
const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
};

export default function CheckoutPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [shipping, setShipping] = useState("reguler");      // UI tetap
    const [paymentMethod, setPaymentMethod] = useState("transfer");
    const [recipientName, setRecipientName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // ==================== LOAD CART ====================
    const fetchCart = async () => {
        try {
            const token = getCookie("token");
            if (!token) return alert("Login dulu sebelum checkout!");

            const res = await fetch("http://localhost:8000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data);

            setCart(data.cart_items);

        } catch (err) {
            console.error(err);
            alert("Gagal memuat cart");
        }
    };

    useEffect(() => { fetchCart(); }, []);

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shippingCost = shipping === "express" ? 25000 : 10000;   // UI bebas
    const total = subtotal + shippingCost;

    // ==================== CHECKOUT ====================
    const handleCheckout = async () => {
        if (!recipientName || !phone || !address)
            return alert("Lengkapi semua data pengiriman!");

        const token = getCookie("token");
        if (!token) return alert("Harus login!");

        const payload = {
            items: cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                subtotal: item.quantity * item.product.price
            })),
            name: recipientName,
            no_tlp: phone,
            address,
            delivery: "kurir",          // FIX WAJIB sesuai enum DB
            payment: paymentMethod,
            total
        };

        try {
            const res = await fetch("http://localhost:8000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log(data);

            if (!res.ok) return alert("Checkout gagal, cek console!");

            alert("Pesanan berhasil dibuat!");
            localStorage.setItem("latestOrder", JSON.stringify(data.order));
            window.location.href = "/marketplace/pesanan";

        } catch (err) {
            console.log(err);
            alert("Gagal memproses pesanan");
        }
    };

    const BASE_INPUT = "w-full border-2 rounded-xl p-3 outline-none transition duration-200 text-gray-800 placeholder-gray-500 focus:border-[#FF6D1F]";

    // =================== UI (tidak diubah) ===================
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">

                {/* Form */}
                <div className="flex-1">
                    <div className="bg-white p-8 shadow-2xl rounded-2xl border-t-8 border-[#234C6A]">
                        <h1 className="text-3xl font-bold text-[#234C6A] mb-8 flex items-center gap-3">
                            <ShoppingBag size={30} className="text-[#FF6D1F]" /> Konfirmasi Checkout
                        </h1>

                        <div className="space-y-6">
                            <div>
                                <label className="font-semibold flex items-center gap-2 text-gray-700 mb-2">
                                    <User size={18} className="text-[#FF6D1F]" /> Nama
                                </label>
                                <input className={BASE_INPUT} value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Nama penerima"/>
                            </div>

                            <div>
                                <label className="font-semibold flex items-center gap-2 text-gray-700 mb-2">
                                    <Phone size={18} className="text-[#FF6D1F]" /> No Telepon
                                </label>
                                <input className={BASE_INPUT} value={phone} onChange={e => setPhone(e.target.value)} placeholder="08xxxx" />
                            </div>

                            <div>
                                <label className="font-semibold flex items-center gap-2 text-gray-700 mb-2">
                                    <MapPin size={18} className="text-[#FF6D1F]" /> Alamat
                                </label>
                                <textarea className={`${BASE_INPUT} h-24`} value={address} onChange={e => setAddress(e.target.value)} placeholder="Alamat lengkap" />
                            </div>

                            <div>
                                <label className="font-semibold">Metode Pengiriman</label>
                                <select value={shipping} onChange={e => setShipping(e.target.value)} className={BASE_INPUT}>
                                    <option value="reguler">Reguler (10.000)</option>
                                    <option value="express">Express (25.000)</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold">Metode Pembayaran</label>
                                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={BASE_INPUT}>
                                    <option value="transfer">Transfer Bank</option>
                                    <option value="tunai">Bayar di Tempat</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="w-full md:w-96">
                    <div className="bg-white p-6 shadow-2xl rounded-2xl border-t-8 border-[#FF6D1F] md:sticky md:top-6">
                        <h2 className="text-2xl font-bold text-[#234C6A] border-b pb-3 mb-5">Ringkasan</h2>

                        <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between border-b pb-1">
                                    <span>{item.product.name} x{item.quantity}</span>
                                    <span>Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between"><span>Subtotal</span><span>Rp {subtotal.toLocaleString("id-ID")}</span></div>
                            <div className="flex justify-between"><span>Ongkir</span><span>Rp {shippingCost.toLocaleString("id-ID")}</span></div>
                            <div className="flex justify-between font-bold text-xl border-t pt-3">
                                <span>Total</span><span className="text-[#FF6D1F]">Rp {total.toLocaleString("id-ID")}</span>
                            </div>
                        </div>

                        <button onClick={handleCheckout} className="mt-6 w-full bg-[#FF6D1F] hover:bg-[#E05B1B] text-white py-3 rounded-full flex items-center justify-center gap-2 font-bold">
                            <Send /> Bayar Sekarang
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
