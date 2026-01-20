"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";
import Link from "next/link";
import FavoriteButton from "../components/FavoriteButton";
import { useSearchParams } from "next/navigation";
import Footer from "../components/Footer"; // <--- 1. FOOTER IMPORT EKLENDİ

export default function Home() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("Misafir");

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
         let name = "Misafir";
         if (user.user_metadata?.username) {
            name = user.user_metadata.username;
         } else if (user.email) {
            name = user.email.split('@')[0];
         }
         setDisplayName(name.charAt(0).toUpperCase() + name.slice(1));
      }

      let query = supabase.from('books').select('*').order('id', { ascending: true });
      
      if (category) {
          query = query.eq('category', category);
      }

      const { data: booksData } = await query;
      setBooks(booksData || []);
      setLoading(false);
    }

    fetchData();
  }, [category]);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto custom-scrollbar flex flex-col">
        <div className="p-8 md:p-12 flex-1">
           
           <header className="mb-12 flex items-end justify-between">
              <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">GERZEGEN KÜTÜPHANESİ</p>
                  <h1 className="text-4xl md:text-5xl font-black text-[#202020] tracking-tight">
                    Hoşgeldin, <span className="text-[#00537d]">
                        {loading ? "..." : displayName}
                    </span>
                  </h1>
              </div>
              
              <div className="hidden md:block text-right">
                  <p className="text-[#00537d] font-bold text-lg">{new Date().toLocaleDateString('tr-TR', { weekday: 'long' })}</p>
                  <p className="text-gray-400 text-sm">{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
           </header>

           <section>
              <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-[#202020] text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-8 h-0.5 bg-[#00537d]"></span>
                    {category 
                        ? `${category} KİTAPLARI`.toLocaleUpperCase('tr-TR') 
                        : "TÜM KİTAPLAR"
                    }
                  </h3>
                  <span className="text-gray-400 text-xs font-bold">
                    {loading ? "..." : books.length} KİTAP
                  </span>
              </div>

              {loading ? (
                 <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
              ) : books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {books.map((book) => (
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
                            <span className="text-white font-bold uppercase tracking-widest text-xs border border-white/30 px-4 py-2 rounded-full">İNCELE</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-[#202020] text-lg leading-tight mb-1 group-hover:text-[#00537d] transition-colors">{book.title}</h3>
                      <p className="text-sm text-gray-400">{book.author}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-bold">Bu kategoride henüz kitap yok.</p>
                </div>
              )}
           </section>

        </div>
        
        {/* --- 2. FOOTER EKLENDİ --- */}
        <div className="mt-auto border-t border-gray-100 bg-white">
           <Footer />
        </div>

      </main>
    </div>
  );
}