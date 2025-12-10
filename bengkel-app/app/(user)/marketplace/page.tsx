"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/user/ProductCard";
import { addToCart } from "@/lib/cart";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id:number;
  name:string;
  price:number;
  stock:number;
  jenis_barang:string;
  img_url:string;
}

export default function MarketplacePage(){

  const [products,setProducts]=useState<Product[]>([]);
  const [filtered,setFiltered]=useState<Product[]>([]);
  const [cartCount,setCartCount]=useState(0);

  // Search & filter
  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("all");

  // =================== PROMO SLIDER ====================
  const promoImages = [
    "/promo/promo1.jpg",
    "/promo/promo2.jpg",
    "/promo/promo3.jpg",
  ];

  const [slide,setSlide] = useState(0);

  const nextSlide = ()=> setSlide((prev)=>(prev+1) % promoImages.length);
  const prevSlide = ()=> setSlide((prev)=>(prev-1+promoImages.length) % promoImages.length);

  // Auto slide setiap 3 detik
  useEffect(()=>{
    const auto = setInterval(nextSlide,3000);
    return ()=> clearInterval(auto);
  },[]);

  // ===== FETCH PRODUK =====
  const fetchProducts=async()=>{
    const res=await fetch("http://localhost:8000/api/products");
    const data=await res.json();
    setProducts(data.products);
    setFiltered(data.products);
  };

  const updateCartCount=async()=>{
    const token=document?.cookie.match(/token=([^;]+)/)?.[1];
    if(!token) return;
    const res=await fetch("http://localhost:8000/api/cart",{headers:{Authorization:`Bearer ${token}`}});
    const data=await res.json();
    setCartCount(data.cart_items?.length||0);
  };

  useEffect(()=>{ fetchProducts(); updateCartCount(); },[]);

  // ===== SEARCH + FILTER =====
  useEffect(()=>{
    let result=[...products];

    if(category !== "all"){
      result = result.filter(p=>p.jenis_barang.toLowerCase()===category.toLowerCase());
    }

    if(search.trim()!==""){
      result = result.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));
    }

    setFiltered(result);
  },[search,category,products]);

  const handleAddToCart=async(id:number)=>{
    const ok=await addToCart(id);
    if(ok){
      updateCartCount();
      alert("Produk ditambahkan ke keranjang!");
    }
  };

  return(
    <div className="max-w-6xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-3xl font-bold text-[#234C6A]">Marketplace Produk</h1>

        <a href="/cart" className="relative">
          <ShoppingCart size={32} className="text-[#FF6D1F]"/>
          {cartCount>0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2">
              {cartCount}
            </span>
          )}
        </a>
      </div>

      {/* ================= PROMO SLIDER ================= */}
      <div className="relative w-full h-40 sm:h-56 rounded-xl overflow-hidden mb-6 shadow-lg">

        <img
          src={promoImages[slide]}
          className="w-full h-full object-cover transition-all duration-700"
          alt="promo"
        />

        {/* Tombol prev/next */}
        <button onClick={prevSlide} className="absolute top-1/2 -translate-y-1/2 left-2 bg-white/70 p-2 rounded-full">
          <ChevronLeft size={22}/>
        </button>
        <button onClick={nextSlide} className="absolute top-1/2 -translate-y-1/2 right-2 bg-white/70 p-2 rounded-full">
          <ChevronRight size={22}/>
        </button>

        {/* Indicator dot */}
        <div className="absolute bottom-3 w-full flex justify-center gap-2">
          {promoImages.map((_,i)=>(
            <span key={i} className={`w-3 h-3 rounded-full ${
              i===slide ? "bg-[#FF6D1F]" : "bg-white/60"
            }`}></span>
          ))}
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          placeholder="Cari produk..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="w-full border p-3 rounded-xl outline-none text-gray-700 focus:ring-2 focus:ring-[#FF6D1F]"
        />
        <select
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
          className="w-full sm:w-48 border p-3 rounded-xl text-gray-700 focus:ring-2 focus:ring-[#FF6D1F]"
        >
          <option value="all">Semua Produk</option>
          <option value="sparepart">Sparepart</option>
          <option value="aksesoris">Aksesoris</option>
        </select>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.length>0 ? filtered.map(p=>(
          <ProductCard 
            key={p.id}
            product={p}
            onAdd={handleAddToCart}
            onClick={()=>{
              localStorage.setItem("selectedProduct",JSON.stringify(p));
              window.location.href="/marketplace/detailProduk";
            }}
          />
        )) : (
          <p className="col-span-full text-center text-gray-500">
            Produk tidak ditemukan...
          </p>
        )}
      </div>
    </div>
  );
}
