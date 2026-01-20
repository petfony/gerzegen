"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function MarkReadButton({ bookId, onStatusChange }) {
  const [isRead, setIsRead] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkStatus();
  }, [bookId]);

  const checkStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data } = await supabase
        .from('user_books')
        .select('*')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .single();
      
      if (data) {
          setIsRead(true);
          if (onStatusChange) onStatusChange(true);
      }
    }
    setLoading(false);
  };

  const toggleRead = async () => {
    if (!user) return alert("Bunu işaretlemek için giriş yapmalısın.");
    setLoading(true);

    if (isRead) {
      const { error } = await supabase.from('user_books').delete().eq('user_id', user.id).eq('book_id', bookId);
      if (!error) {
          setIsRead(false);
          if (onStatusChange) onStatusChange(false); 
      }
    } else {
      const { error } = await supabase.from('user_books').insert({ user_id: user.id, book_id: bookId });
      if (!error) {
          setIsRead(true);
          if (onStatusChange) onStatusChange(true); 
      }
    }
    setLoading(false);
  };

  if (loading) return <div className="h-10 w-32 bg-gray-100 rounded-xl animate-pulse"></div>;

  return (
    <button 
      onClick={toggleRead}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:-translate-y-1 ${
        isRead 
          // --- BURAYI DEĞİŞTİRDİK ---
          // Eskisi: bg-green-100 text-green-700 border-green-200
          // Yenisi: Senin kırmızının %10 okanlığı (bg) ve kendisi (text)
          ? "bg-[#bf293d]/10 text-[#bf293d] border border-[#bf293d]/20" 
          : "bg-white text-gray-500 border border-gray-200 hover:border-[#00537d] hover:text-[#00537d]"
      }`}
    >
      <span className="material-icons text-lg">
        {isRead ? "check_circle" : "radio_button_unchecked"}
      </span>
      {isRead ? "OKUNDU" : "OKUDUM OLARAK İŞARETLE"}
    </button>
  );
}