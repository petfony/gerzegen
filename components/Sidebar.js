"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase"; // Hata alırsan burayı "../../lib/supabase" yapmayı dene
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]); 
  const [showCategories, setShowCategories] = useState(true); 

  useEffect(() => {
    // Kullanıcıyı getir
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    // Kategorileri getir (Tekrarlayanları süzerek)
    const getCategories = async () => {
      const { data } = await supabase.from('books').select('category');
      if (data) {
        // Set kullanarak benzersizleri al, filter(Boolean) ile boş olanları at
        const uniqueCategories = [...new Set(data.map(item => item.category))].filter(Boolean);
        setCategories(uniqueCategories);
      }
    };

    getUser();
    getCategories();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Link tıklamasını engelle
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login"); // Çıkış yapınca login sayfasına at
  };

  return (
    <aside className="w-20 md:w-64 h-full bg-white border-r border-gray-100 flex flex-col shrink-0 transition-all duration-300">
      
      {/* LOGO ALANI */}
      <div className="p-6 md:p-8 flex items-center justify-center md:justify-start">
        <Link href="/">
          {/* Logo varsa göster, yoksa yazı yaz */}
          <img 
            src="/logo.webp" 
            alt="Gerzegen Logo" 
            className="w-10 md:w-32 h-auto object-contain hover:opacity-80 transition-opacity" 
            onError={(e) => {
              e.target.style.display = 'none'; // Resim yüklenmezse gizle
            }}
          />
          {/* Yedek Logo Yazısı (Resim yoksa bu görünür) */}
          <span className="hidden md:block font-black text-xl text-[#00537d] ml-2 logo-fallback" style={{display: 'none'}}>
            GERZEGEN
          </span>
        </Link>
      </div>

      {/* MENÜ LİNKLERİ */}
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
        
        {/* KÜTÜPHANE LİNKİ */}
        <Link
          href="/"
          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
            pathname === "/" 
              ? "bg-[#00537d] text-white shadow-lg shadow-[#00537d]/30" 
              : "text-gray-500 hover:bg-gray-50 hover:text-[#00537d]"
          }`}
        >
          <span className={`material-icons ${pathname === "/" ? "text-white" : "text-gray-400 group-hover:text-[#00537d]"}`}>
            library_books
          </span>
          <span className="font-bold text-sm hidden md:block">Kütüphane</span>
        </Link>

        {/* KATEGORİLER (AÇILIR MENÜ) */}
        <div>
            <button 
                onClick={() => setShowCategories(!showCategories)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-[#00537d] transition-all group"
            >
                <div className="flex items-center gap-4">
                    <span className="material-icons text-gray-400 group-hover:text-[#00537d]">category</span>
                    <span className="font-bold text-sm hidden md:block">Kategoriler</span>
                </div>
                <span className={`material-icons text-sm transition-transform duration-300 hidden md:block ${showCategories ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showCategories ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-12 pr-2 py-2 space-y-1">
                    {categories.length > 0 ? categories.map((cat, index) => (
                        <Link 
                            key={index} 
                            href={`/?category=${cat}`} 
                            className="block py-2 text-xs font-bold text-gray-400 hover:text-[#00537d] transition-colors truncate"
                        >
                            {cat}
                        </Link>
                    )) : (
                        <span className="text-[10px] text-gray-300 pl-2">Kategori yok</span>
                    )}
                </div>
            </div>
        </div>

        {/* FAVORİLERİM LİNKİ */}
        <Link
          href="/favorites"
          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
            pathname === "/favorites" 
              ? "bg-[#00537d] text-white shadow-lg shadow-[#00537d]/30" 
              : "text-gray-500 hover:bg-gray-50 hover:text-[#00537d]"
          }`}
        >
          <span className={`material-icons ${pathname === "/favorites" ? "text-white" : "text-gray-400 group-hover:text-[#00537d]"}`}>
            favorite
          </span>
          <span className="font-bold text-sm hidden md:block">Favorilerim</span>
        </Link>

      </nav>

      {/* ALT KISIM: PROFİL / GİRİŞ YAP */}
      <div className="p-4 border-t border-gray-100">
        {user ? (
          <div className="flex flex-col md:flex-row items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
             {/* Kullanıcı Harfi */}
             <div className="w-10 h-10 rounded-full bg-[#00537d] text-white flex items-center justify-center font-bold uppercase text-xs shrink-0">
                {user.email?.[0] || "U"}
             </div>
             {/* Kullanıcı Bilgisi ve Çıkış Butonu */}
             <div className="hidden md:block overflow-hidden flex-1">
                <p className="text-xs font-bold text-[#202020] truncate w-full group-hover:text-[#00537d]">
                  {user.email}
                </p>
                <button 
                  onClick={handleLogout} 
                  className="text-[10px] text-[#bf293d] font-bold uppercase tracking-widest hover:underline text-left w-full mt-1"
                >
                  Çıkış Yap
                </button>
             </div>
          </div>
        ) : (
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-[#00537d] hover:text-white transition-colors group text-gray-500">
             <span className="material-icons text-gray-400 group-hover:text-white">login</span>
             <span className="font-bold text-sm hidden md:block">Giriş Yap</span>
          </Link>
        )}
      </div>
    </aside>
  );
}