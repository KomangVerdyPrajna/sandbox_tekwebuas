'use client';

import React, { useState, useMemo, useEffect, FormEvent } from 'react';
import { Trash2 } from 'lucide-react';

/* =======================
   TIPE DATA
======================= */
interface CartItem {
    id: string;
    type: 'product' | 'service_manual' | 'booking_pelunasan';
    name: string;
    price: number;
    quantity: number;
    originalId: number | null;
}

interface Product {
    id: number;
    name: string;
    price?: number;
    stock?: number;
    jenis_barang?: string;
}

interface Booking {
    id: number;
    code: string;
    user_id: number | null;
    jenis_service: string;
    remaining_due?: number;
    no_wa: string | null;
    nama_kendaraan: string | null;
}

/* =======================
   TYPE GUARD
======================= */
const isBooking = (item: Product | Booking): item is Booking => {
    return (item as Booking).code !== undefined;
};

/* =======================
   TOKEN COOKIE
======================= */
const getTokenFromCookies = (): string | undefined => {
    if (typeof document === 'undefined') return undefined;
    const name = 'token=';
    const cookies = decodeURIComponent(document.cookie).split(';');
    for (let c of cookies) {
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length);
    }
    return undefined;
};

/* =======================
   INPUT JASA MANUAL
======================= */
const ServiceInput: React.FC<{ onAddItem: (item: CartItem) => void }> = ({ onAddItem }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const handleAdd = (e: FormEvent) => {
        e.preventDefault();
        if (!name || !price) return;

        onAddItem({
            id: `manual-${Date.now()}`,
            type: 'service_manual',
            name: `Jasa: ${name}`,
            price: parseFloat(price),
            quantity: 1,
            originalId: null,
        });

        setName('');
        setPrice('');
    };

    return (
        <form onSubmit={handleAdd} className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 shadow text-black">
            <h4 className="font-bold mb-3 text-black">Tambah Jasa Manual</h4>
            <input
                type="text"
                placeholder="Nama Jasa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-2 p-2 rounded border text-black placeholder:text-gray-400"
                required
            />
            <input
                type="number"
                placeholder="Harga"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mb-3 p-2 rounded border text-black placeholder:text-gray-400"
                required
            />
            <button className="w-full bg-yellow-600 text-black py-2 rounded-lg font-semibold hover:bg-yellow-700">
                Tambah Jasa
            </button>
        </form>
    );
};

/* =======================
   SEARCH INPUT
======================= */
const ItemSearchInput: React.FC<{ onSelect: (item: CartItem) => void }> = ({ onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<(Product | Booking)[]>([]);
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000/api';

    useEffect(() => {
        if (searchTerm.length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            const token = getTokenFromCookies();

            try {
                const [pRes, bRes] = await Promise.all([
                    fetch(`${API_URL}/products/search/cashier?q=${searchTerm}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_URL}/bookings/pending/search?q=${searchTerm}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const products = pRes.ok ? (await pRes.json()).products || [] : [];
                const bookings = bRes.ok ? (await bRes.json()).data || [] : [];

                setResults([...products, ...bookings]);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSelect = (item: Product | Booking) => {
        let cartItem: CartItem;

        if (isBooking(item)) {
            cartItem = {
                id: `booking-${item.id}`,
                type: 'booking_pelunasan',
                name: `PELUNASAN: ${item.jenis_service} (${item.code})`,
                price: item.remaining_due ?? 0,
                quantity: 1,
                originalId: item.id,
            };
        } else {
            cartItem = {
                id: `prod-${item.id}`,
                type: 'product',
                name: item.name,
                price: item.price ?? 0,
                quantity: 1,
                originalId: item.id,
            };
        }

        onSelect(cartItem);
        setSearchTerm('');
        setResults([]);
    };

    return (
        <div className="relative text-black">
            <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari produk / booking..."
                className="w-full p-4 rounded-xl border shadow text-black placeholder:text-gray-400"
            />

            {(loading || results.length > 0) && (
                <div className="absolute z-20 w-full bg-white rounded-xl border shadow mt-2 max-h-60 overflow-y-auto text-black">
                    {loading && <p className="p-3 text-center">Memuat...</p>}
                    {!loading &&
                        results.map((item) => (
                            <div
                                key={isBooking(item) ? `b-${item.id}` : `p-${item.id}`}
                                onClick={() => handleSelect(item)}
                                className="p-3 hover:bg-indigo-50 cursor-pointer border-b"
                            >
                                {isBooking(item) ? (
                                    <>
                                        <p className="font-semibold text-black">
                                            [BOOKING] {item.jenis_service}
                                        </p>
                                        <p className="text-xs">
                                            Sisa: Rp {(item.remaining_due ?? 0).toLocaleString('id-ID')}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold text-black">{item.name}</p>
                                        <p className="text-xs">
                                            Rp {(item.price ?? 0).toLocaleString('id-ID')} | Stok {item.stock ?? 0}
                                        </p>
                                    </>
                                )}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

/* =======================
   MAIN PAGE
======================= */
const CashierPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'Transfer'>('Cash');
    const [isProcessing, setIsProcessing] = useState(false);

    const total = useMemo(
        () => cartItems.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0),
        [cartItems]
    );

    const handleAddItem = (item: CartItem) => {
        const index = cartItems.findIndex(
            (i) => i.originalId === item.originalId && i.type === item.type && item.type === 'product'
        );

        if (index > -1) {
            const updated = [...cartItems];
            updated[index].quantity += 1;
            setCartItems(updated);
        } else {
            setCartItems((prev) => [...prev, item]);
        }
    };

    const handleRemoveItem = (id: string) => {
        setCartItems((prev) => prev.filter((i) => i.id !== id));
    };

    const handleProcessTransaction = async () => {
        if (cartItems.length === 0) {
            alert('Keranjang kosong');
            return;
        }
        setIsProcessing(true);
        setTimeout(() => {
            alert('Transaksi berhasil');
            setCartItems([]);
            setPaymentMethod('Cash');
            setIsProcessing(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 text-black">
            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
                <div className="col-span-8 space-y-6">
                    <h1 className="text-3xl font-extrabold text-black">Point of Sale</h1>

                    <ItemSearchInput onSelect={handleAddItem} />

                    <div className="grid grid-cols-2 gap-6">
                        <ServiceInput onAddItem={handleAddItem} />
                        <div className="bg-white rounded-xl shadow p-6 text-center text-black">
                            Manajemen Pelanggan (Coming Soon)
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full text-sm text-black">
                            <thead className="bg-slate-200">
                                <tr>
                                    <th className="p-3 text-left font-semibold">Item</th>
                                    <th className="p-3 text-center font-semibold">Qty</th>
                                    <th className="p-3 text-right font-semibold">Subtotal</th>
                                    <th className="p-3 text-center font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3 text-center">{item.quantity}</td>
                                        <td className="p-3 text-right">
                                            Rp {((item.price ?? 0) * item.quantity).toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => handleRemoveItem(item.id)}>
                                                <Trash2 size={16} className="text-red-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-span-4 sticky top-6 h-fit">
                    <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 text-black">
                        <h2 className="text-2xl font-bold text-black">Checkout</h2>

                        <div className="bg-indigo-600 text-white rounded-xl p-5">
                            <p className="text-sm">Total</p>
                            <p className="text-4xl font-extrabold">
                                Rp {total.toLocaleString('id-ID')}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {['Cash', 'Card', 'Transfer'].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setPaymentMethod(m as any)}
                                    className={`p-3 rounded-lg font-semibold ${
                                        paymentMethod === m
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-black'
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={isProcessing}
                            onClick={handleProcessTransaction}
                            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-xl"
                        >
                            {isProcessing ? 'Memproses...' : 'SELESAIKAN TRANSAKSI'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CashierPage;
