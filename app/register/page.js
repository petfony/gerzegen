"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  // STATE'LER (Formdaki kutucuklar)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Yeni
  const [city, setCity] = useState("");         // Yeni
  const [district, setDistrict] = useState(""); // Yeni
  const [birthDate, setBirthDate] = useState(""); // Yeni
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Supabase'e kayıt ol emri gönderiyoruz
    // options.data içine yazdığımız her şey "Metadata" olarak saklanır.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          city: city,
          district: district,
          birth_date: birthDate,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.refresh();
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 py-10">
      <div className="w-full max-w-md p-8 space-y-8 bg-white border border-gray-100 rounded-2xl shadow-xl">
        
        {/* BAŞLIK */}
        <div className="text-center">
          <div className="w-12 h-12 bg-[#00537d] rounded-xl flex items-center justify-center text-white mx-auto mb-4">
             <span className="material-icons text-2xl">person_add</span>
          </div>
          <h2 className="text-3xl font-black text-[#202020] tracking-tight">Aramıza Katıl</h2>
          <p className="mt-2 text-sm text-gray-400">Birkaç saniyede formunu doldur.</p>
        </div>

        {/* FORM */}
        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          
          {/* KULLANICI ADI */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kullanıcı Adı</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00537d] focus:border-transparent outline-none transition-all text-sm font-bold text-[#202020]"
              placeholder="okurkurt"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* İL */}
             <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">İl</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00537d] focus:border-transparent outline-none transition-all text-sm"
                  placeholder="İstanbul"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
             </div>
             {/* İLÇE */}
             <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">İlçe</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00537d] focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Kadıköy"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
             </div>
          </div>

          {/* DOĞUM TARİHİ */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Doğum Tarihi</label>
            <input
              type="date"
              required
              className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00537d] focus:border-transparent outline-none transition-all text-sm text-gray-600"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00537d] focus:border-transparent outline-none transition-all text-sm"
              placeholder="senin@mailin.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* ŞİFRE */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Şifre</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00537d] focus:border-transparent outline-none transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* HATA MESAJI */}
          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg font-bold border border-red-100">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#00537d] hover:bg-[#003c5a] text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl disabled:opacity-50 text-sm"
          >
            {loading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>

          <div className="text-center text-xs text-gray-500 font-medium">
            Zaten hesabın var mı?{" "}
            <Link href="/login" className="text-[#00537d] font-bold hover:underline">
              Giriş Yap
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}