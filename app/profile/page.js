"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Sidebar from "../../components/Sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("books");
  const [readBooks, setReadBooks] = useState({}); 

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [message, setMessage] = useState(null); 
  const [msgType, setMsgType] = useState(""); 

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        router.push("/login");
        return;
    }
    setUser(user);

    if (user.user_metadata) {
        setCity(user.user_metadata.city || "");
        setDistrict(user.user_metadata.district || "");
    }

    const { data } = await supabase
      .from('user_books')
      .select('book_id, created_at, books(*)') 
      .eq('user_id', user.id);

    if (data) {
       const grouped = {};
       data.forEach((item) => {
          const book = item.books;
          if (!book) return;
          const category = book.category || "Diğer";
          if (!grouped[category]) grouped[category] = [];
          grouped[category].push(book);
       });
       setReadBooks(grouped);
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      data: { city: city, district: district }
    });

    if (error) {
      setMsgType("error");
      setMessage("Güncelleme hatası: " + error.message);
    } else {
      setMsgType("success");
      setMessage("Profil bilgilerin başarıyla güncellendi.");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
        setMsgType("error");
        setMessage("Şifre en az 6 karakter olmalı.");
        return;
    }
    if (newPassword !== confirmPassword) {
        setMsgType("error");
        setMessage("Şifreler birbiriyle uyuşmuyor.");
        return;
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        setMsgType("error");
        setMessage("Şifre değiştirilemedi: " + error.message);
    } else {
        setMsgType("success");
        setMessage("Şifren başarıyla değiştirildi.");
        setNewPassword("");
        setConfirmPassword("");
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
         
         <div className="flex flex-col md:flex-row items-center gap-6 mb-12 pb-12 border-b border-gray-100">
            <div className="w-24 h-24 bg-[#00537d] rounded-full flex items-center justify-center text-white text-4xl font-bold uppercase shadow-xl shadow-[#00537d]/20">
                {user?.user_metadata?.username?.[0] || user?.email?.[0]}
            </div>
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-black text-[#202020]">
                    {user?.user_metadata?.username || "Kullanıcı"}
                </h1>
                <p className="text-gray-400 font-medium">{user?.email}</p>
                <div className="mt-3 flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
                    <span className="material-icons text-sm">location_on</span>
                    {user?.user_metadata?.city || "Şehir Girilmedi"} / {user?.user_metadata?.district || "-"}
                </div>
            </div>
         </div>

         <div className="flex gap-8 mb-10 border-b border-gray-100">
            <button 
                onClick={() => setActiveTab("books")}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'books' ? 'text-[#00537d] border-b-2 border-[#00537d]' : 'text-gray-400 hover:text-[#202020]'}`}
            >
                Kütüphanem
            </button>
            <button 
                onClick={() => setActiveTab("settings")}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'text-[#00537d] border-b-2 border-[#00537d]' : 'text-gray-400 hover:text-[#202020]'}`}
            >
                Ayarlar
            </button>
         </div>

         {message && (
             <div className={`p-4 mb-8 rounded-xl text-sm font-bold ${
                 msgType === 'success' 
                 ? 'bg-green-50 text-green-700 border border-green-100' 
                 // HATA MESAJI RENGİ GÜNCELLENDİ
                 : 'bg-[#bf293d]/5 text-[#bf293d] border border-[#bf293d]/20'
             }`}>
                 {message}
             </div>
         )}

         {activeTab === "books" && (
             loading ? (
                <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
             ) : Object.keys(readBooks).length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <span className="material-icons text-6xl text-gray-300 mb-4">auto_stories</span>
                    <p className="text-gray-500 font-bold">Henüz hiç kitap bitirmemişsin.</p>
                    <Link href="/" className="text-[#00537d] text-sm font-bold hover:underline mt-2 block">Kütüphaneye git</Link>
                </div>
             ) : (
                <div className="space-y-12 animate-in fade-in duration-500">
                    {Object.entries(readBooks).map(([category, books]) => (
                        <div key={category}>
                            <h3 className="flex items-center gap-3 font-black text-[#202020] text-sm uppercase tracking-[0.2em] mb-6 pb-2 border-b border-gray-100">
                                <span className="w-2 h-2 rounded-full bg-[#00537d]"></span>
                                {category}
                                <span className="text-gray-300 ml-auto text-xs">{books.length} Kitap</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {books.map((book) => (
                                    <Link key={book.id} href={`/books/${book.slug}`} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#00537d]/30 hover:shadow-lg transition-all group">
                                        <div className="w-16 h-24 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                                            {book.cover ? <img src={book.cover} className="w-full h-full object-cover" /> : null}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-[#202020] truncate group-hover:text-[#00537d] transition-colors">{book.title}</h4>
                                            <p className="text-xs text-gray-400 mb-2">{book.author}</p>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 w-max px-2 py-1 rounded">
                                                <span className="material-icons text-[10px]">check</span> Okundu
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
             )
         )}

         {activeTab === "settings" && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
                 
                 <div>
                     <h3 className="font-black text-[#202020] text-lg mb-6 flex items-center gap-2">
                         <span className="material-icons text-[#00537d]">face</span> Profil Bilgileri
                     </h3>
                     <form onSubmit={handleUpdateProfile} className="space-y-5 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                         <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Şehir (İl)</label>
                            <input 
                                type="text" 
                                className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-[#00537d] focus:ring-1 focus:ring-[#00537d] outline-none text-sm font-bold text-[#202020]"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="Örn: İstanbul"
                            />
                         </div>
                         <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">İlçe</label>
                            <input 
                                type="text" 
                                className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-[#00537d] focus:ring-1 focus:ring-[#00537d] outline-none text-sm font-bold text-[#202020]"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                placeholder="Örn: Kadıköy"
                            />
                         </div>
                         <button type="submit" className="w-full py-3 bg-[#202020] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#00537d] transition-colors shadow-lg">
                             Bilgileri Güncelle
                         </button>
                     </form>
                 </div>

                 {/* ŞİFRE ALANI RENKLERİ GÜNCELLENDİ */}
                 <div>
                     <h3 className="font-black text-[#202020] text-lg mb-6 flex items-center gap-2">
                         <span className="material-icons text-[#bf293d]">lock_reset</span> Şifre Değiştir
                     </h3>
                     <form onSubmit={handleUpdatePassword} className="space-y-5 bg-white p-8 rounded-3xl border border-[#bf293d]/20 shadow-sm">
                         <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Yeni Şifre</label>
                            <input 
                                type="password" 
                                className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-[#bf293d] focus:ring-1 focus:ring-[#bf293d] outline-none text-sm"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                         </div>
                         <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Yeni Şifre (Tekrar)</label>
                            <input 
                                type="password" 
                                className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-[#bf293d] focus:ring-1 focus:ring-[#bf293d] outline-none text-sm"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                         </div>
                         <button type="submit" className="w-full py-3 bg-[#bf293d] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#a62233] transition-colors shadow-lg shadow-[#bf293d]/20">
                             Şifreyi Değiştir
                         </button>
                     </form>
                 </div>

             </div>
         )}

      </main>
    </div>
  );
}