"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  onSubmit: (review: { rating:number; comment:string }) => void;
}

export default function AddReview({ onSubmit }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating < 1) return alert("Berikan rating minimal 1 ⭐");
    if (!comment.trim()) return alert("Tulis ulasan sebelum submit!");

    onSubmit({ rating, comment });

    alert("Ulasan berhasil dikirim!");
    setRating(0);
    setComment("");
  };

  return (
    <div className="bg-white shadow-lg p-5 rounded-xl mt-4 space-y-4">

      <h2 className="text-xl font-bold text-[#234C6A]">Beri Ulasan Produk</h2>

      {/* RATING STAR */}
      <div className="flex gap-1">
        {[1,2,3,4,5].map((num)=>(
          <Star
            key={num}
            size={32}
            onClick={()=>setRating(num)}
            className={`cursor-pointer transition ${
              num <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
            }`}
          />
        ))}
      </div>

      {/* COMMENT TEXTAREA */}
      <textarea
        value={comment}
        onChange={(e)=>setComment(e.target.value)}
        placeholder="Ceritakan pengalamanmu..."
        className="w-full border rounded-lg p-3 h-28 focus:border-[#234C6A] focus:ring-[#234C6A] outline-none"
      />

      {/* SUBMIT BUTTON */}
      <button
        onClick={handleSubmit}
        className="w-full bg-[#FF6D1F] text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
      >
        Kirim Ulasan
      </button>

    </div>
  );
}
