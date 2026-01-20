"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function FavoriteButton({ bookId }) {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFav();
  }, []);

  const checkFav = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .single();
      
      if (data) setIsFav(true);
    }
    setLoading(false);
  };

  const toggleFav = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Aşkını ilan etmek için önce giriş yapmalısın.");

    const oldState = isFav;
    setIsFav(!isFav);

    if (oldState) {
      const { error } = await supabase.from('user_favorites').delete().eq('user_id', user.id).eq('book_id', bookId);
      if (error) setIsFav(oldState); 
    } else {
      const { error } = await supabase.from('user_favorites').insert({ user_id: user.id, book_id: bookId });
      if (error) setIsFav(oldState); 
    }
  };

  if (loading) return null;

  return (
    <button 
      onClick={toggleFav}
      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform group/btn"
    >
      {/* RENGİ BURADA DEĞİŞTİRDİK: #bf293d */}
      <span className={`material-icons text-lg transition-colors ${isFav ? 'text-[#bf293d]' : 'text-gray-400 group-hover/btn:text-[#bf293d]/70'}`}>
        {isFav ? "favorite" : "favorite_border"}
      </span>
    </button>
  );
}