"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase"; 
import { useRouter } from "next/navigation";    

export default function ClientReader({ bookTitle, versionName, content, slug }) {
  const [textSize, setTextSize] = useState(20);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  const themes = {
    light: "bg-white text-gray-800",
    sepia: "bg-[#f4ecd8] text-[#5b4636]",
    dark: "bg-[#1a1a1a] text-[#d1d1d1]"
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); 
      } else {
        setLoading(false); 
      }
    };
    checkUser();
  }, []);

  const formatText = (text) => {
    if (!text) return null;
    return text.split('**').map((part, index) => 
      index % 2 === 1 ? <strong key={index} className="font-black text-current">{part}</strong> : part
    );
  };

  if (loading) {
     return (
        <div className="h-screen w-full flex items-center justify-center bg-white text-[#00537d]">
            <span className="material-icons animate-spin text-4xl">autorenew</span>
        </div>
     );
  }

  return (
    <div className={`h-screen w-full flex flex-col overflow-hidden transition-colors duration-300 ${themes[theme]}`}>
      
      {/* ÜST PANEL */}
      <header className={`shrink-0 h-16 border-b flex items-center justify-between px-4 md:px-8 z-50 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : theme === 'sepia' ? 'bg-[#f4ecd8] border-[#eaddc5]' : 'bg-white border-gray-100'
      }`}>
        <Link href={`/books/${slug}`} className="flex items-center gap-2 opacity-70 hover:opacity-100 transition">
          <span className="material-icons">arrow_back</span>
          {/* --- GÜNCELLENEN KISIM --- */}
          <span className="hidden md:inline font-bold uppercase text-[10px] tracking-widest">GERİ DÖN</span>
          {/* ------------------------- */}
        </Link>
        
        <div className="text-center absolute left-1/2 -translate-x-1/2">
            <h1 className="font-bold text-sm md:text-base uppercase tracking-tighter truncate max-w-40 md:max-w-md">{bookTitle}</h1>
            <span className="text-[9px] opacity-60 uppercase tracking-[0.3em] block font-black text-[#00537d]">
                {versionName ? versionName.replace('_', ' ') : 'READER'}
            </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setTextSize(Math.min(32, textSize + 2))} className="w-8 h-8 font-bold hover:bg-black/5 rounded flex items-center justify-center">A+</button>
            <button onClick={() => setTheme(theme === 'light' ? 'sepia' : theme === 'sepia' ? 'dark' : 'light')} className="material-icons text-xl opacity-60 hover:opacity-100 transition">settings_brightness</button>
        </div>
      </header>

      {/* OKUMA ALANI */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
         <article 
            style={{ fontSize: `${textSize}px`, lineHeight: '1.8' }} 
            className="font-serif max-w-3xl mx-auto w-full transition-all duration-300 py-12 px-6 md:px-12 pb-32" 
         >
             {content ? (
                <div className="whitespace-pre-wrap text-justify hyphens-auto">
                  {formatText(content)}
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center opacity-30">
                   <span className="material-icons text-6xl mb-4">menu_book</span>
                   <p className="font-bold uppercase tracking-widest text-xs">Metin bulunamadı.</p>
                </div>
             )}
         </article>
      </main>

      {/* ALT BİLGİ */}
      <footer className={`shrink-0 h-10 flex items-center justify-center text-[10px] tracking-widest uppercase font-bold opacity-30 border-t border-current/5 z-50 ${themes[theme]}`}>
         Gerzegen Reader Mode • Mindverse Design
      </footer>

    </div>
  );
}