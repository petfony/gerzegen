"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; 
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Link eklendi

export default function ProfileContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login"); 
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar">
         <div className="p-8 md:p-12 max-w-3xl">
            
            <header className="mb-12">
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">HESABIM</p>
               <h1 className="text-4xl font-black text-[#202020] tracking-tight">Profil Ayarları</h1>
            </header>

            {loading ? (
                <div className="text-gray-400">Yükleniyor...</div>
            ) : user && (
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-[#00537d] text-white flex items-center justify-center font-black text-3xl uppercase">
                            {user.email?.[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#202020]">Hoşgeldin</h2>
                            <p className="text-gray-500 font-medium">{user.email}</p>
                            <p className="text-xs text-gray-400 mt-1">Son görülme: {new Date(user.last_sign_in_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button className="w-full py-4 px-6 bg-white border border-gray-200 rounded-xl text-left font-bold text-gray-600 hover:border-[#00537d] hover:text-[#00537d] transition-all flex items-center justify-between group">
                            <span>Şifremi Değiştir</span>
                            <span className="material-icons text-gray-300 group-hover:text-[#00537d]">chevron_right</span>
                        </button>

                        <button 
                            onClick={handleLogout}
                            className="w-full py-4 px-6 bg-[#bf293d]/10 border border-[#bf293d]/20 rounded-xl text-left font-bold text-[#bf293d] hover:bg-[#bf293d] hover:text-white transition-all flex items-center justify-between group"
                        >
                            <span>Çıkış Yap</span>
                            <span className="material-icons text-[#bf293d] group-hover:text-white">logout</span>
                        </button>
                    </div>
                </div>
            )}
         </div>
      </main>
    </div>
  );
}