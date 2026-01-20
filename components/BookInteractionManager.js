"use client";
import { useState } from "react";
import MarkReadButton from "./MarkReadButton";
import RateBook from "./RateBook";
import CommentSection from "./CommentSection";

export default function BookInteractionManager({ bookId }) {
  // Başlangıçta gizli (false)
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="space-y-8">
      
      {/* 1. OKUDUM BUTONU */}
      <div className="mb-8">
         <MarkReadButton 
            bookId={bookId} 
            onStatusChange={(status) => setShowContent(status)} 
         />
      </div>

      {/* 2. GİZLİ İÇERİK (Sadece showContent true ise görünür) */}
      {showContent ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           
           {/* PUANLAMA */}
           <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 mb-8">
               {/* --- GÜNCELLENEN METİN --- */}
               <h4 className="font-bold text-[#00537d] text-xs uppercase tracking-widest mb-4 text-center">
                   TEBRİKLER! KİTABI BİTİRDİN. PUANIN KAÇ?
               </h4>
               {/* ------------------------- */}
               <RateBook />
           </div>

           {/* YORUMLAR */}
           <CommentSection />
           
        </div>
      ) : (
        // OKUNMAMIŞSA GÖRÜNECEK MESAJ
        <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 opacity-60">
            <span className="material-icons text-4xl text-gray-300 mb-2">lock</span>
            <p className="text-sm font-bold text-gray-400">Puan vermek ve yorumları görmek için kitabı "Okudum" olarak işaretlemelisin.</p>
        </div>
      )}

    </div>
  );
}