"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function BookActions({ versions, bookSlug }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tarayıcı açılınca hemen sor: Giriş yapan var mı?
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkUser();

    // Dinleyici koy: Olur da yan sekmede çıkış yaparsa burası da güncellensin
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Yüklenirken (Saliselik bir durum) boş veya spinner gösterebilirsin
  if (loading) return <div className="p-4 text-center text-gray-400 text-xs">Kontrol ediliyor...</div>;

  // --- SENARYO 1: KULLANICI GİRİŞ YAPMIŞ (LİNKLERİ GÖSTER) ---
  if (user) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {versions?.map((ver, index) => (
          <Link 
            key={index} 
            href={`/read/${bookSlug}?v=${ver.type}`} 
            className="flex items-center justify-between w-full p-6 rounded-2xl border border-gray-100 hover:border-[#00537d] hover:bg-[#00537d]/5 transition-all group bg-white hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#00537d]/5 text-[#00537d] group-hover:bg-[#00537d] group-hover:text-white transition-colors">
                <span className="material-icons text-2xl">menu_book</span>
              </div>
              <div className="text-left">
                <span className="font-bold text-[#202020] group-hover:text-[#00537d] block text-lg">{ver.name}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Hemen okumaya başla</span>
              </div>
            </div>
            <span className="material-icons text-gray-300 group-hover:text-[#00537d] group-hover:translate-x-1 transition-all">arrow_forward_ios</span>
          </Link>
        ))}
      </div>
    );
  }

  // --- SENARYO 2: KULLANICI YOK (KİLİT GÖSTER) ---
  return (
    <div className="w-full p-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
        <span className="material-icons text-3xl">lock</span>
      </div>
      <h4 className="font-bold text-[#202020] text-lg mb-2">Bu içeriği sadece üyeler görebilir</h4>
      <p className="text-sm text-gray-500 mb-6 max-w-md">
        Kitabın tamamını ve özel versiyonlarını okumak için lütfen giriş yapın veya ücretsiz üye olun.
      </p>
      <div className="flex gap-3">
        <Link href="/login" className="px-6 py-3 bg-[#00537d] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#003c5a] transition">
          Giriş Yap
        </Link>
        <Link href="/register" className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:border-gray-400 transition">
          Kayıt Ol
        </Link>
      </div>
    </div>
  );
}