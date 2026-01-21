"use client";

import { useEffect, useState } from "react";
// Supabase yoluna dikkat (components içinde olduğumuz için ../lib/supabase yeterli olabilir)
// Eğer hata verirse ../../lib/supabase denersin ama genelde ../lib çalışır.
import { supabase } from "../lib/supabase"; 
import Sidebar from "./Sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FavoriteButton from "./FavoriteButton";

export default function FavoritesContent() {
  const [favBooks, setFavBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        router.push("/login");
        return;
    }

    const { data } = await supabase
      .from('user_favorites')
      .select('book_id, books(*)')
      .eq('user_id', user.id);

    if (data) {
        const cleanedData = data
          .map(item => item.books)
          .filter(book => book !== null);
        setFavBooks(cleanedData);
    }
    setLoading(false);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar">
         <div className="p-8 md:p-12">
            
            <header className="mb-12">
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Senin Seçtiklerin</p>
               <h1 className="text-4xl font-black text-[#202020] tracking-tight">Favorilerim</h1>
            </header>

            {loading ? (
                <div className="text-gray-400 text-sm">Yükleniyor...</div>
            ) : favBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {favBooks.map((book) => (
                    <Link key={book.id} href={`/books/${book.slug}`} className="group relative">
                      
                      <div className="aspect-square w-full relative overflow-hidden rounded-2xl bg-gray-100 mb-4 border border-gray-100 group-hover:shadow-2xl group-hover:shadow-[#00537d]/20 transition-all duration-300 group-hover:-translate-y-2">
                        
                        <div className="absolute top-3 right-3 z-20">
                           <FavoriteButton bookId={book.id} />
                        </div>

                        {book.cover ? (
                          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">Kapak Yok</div>
                        )}
                        
                        <div className="absolute inset-0 bg-[#00537d]/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="text-white font-bold uppercase tracking-widest text-xs border border-white/30 px-4 py-2 rounded-full">İncele</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-[#202020] text-lg leading-tight mb-1 group-hover:text-[#00537d] transition-colors">{book.title}</h3>
                      <p className="text-sm text-gray-400">{book.author}</p>
                    </Link>
                  ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <span className="material-icons text-6xl text-red-200 mb-4">favorite_border</span>
                    <p className="text-gray-500 font-bold mb-2">Henüz favori kitabın yok.</p>
                    <Link href="/" className="text-[#00537d] text-sm font-bold hover:underline">Kitaplara göz at</Link>
                </div>
            )}
         </div>
      </main>
    </div>
  );
}