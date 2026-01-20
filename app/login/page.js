"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.refresh();
      router.push("/"); // Başarılıysa ana sayfaya at
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white border border-gray-100 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#00537d] rounded-xl flex items-center justify-center text-white mx-auto mb-4">
             <span className="material-icons text-2xl">auto_stories</span>
          </div>
          <h2 className="text-3xl font-black text-[#202020] tracking-tight">Hoşgeldin</h2>
          <p className="mt-2 text-sm text-gray-400">Gerzegen kütüphanesine giriş yap.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00537d] focus:border-transparent outline-none transition-all"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Şifre</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00537d] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#00537d] hover:bg-[#003c5a] text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {loading ? "Giriliyor..." : "Giriş Yap"}
          </button>

          <div className="text-center text-sm text-gray-500 font-medium">
            Hesabın yok mu?{" "}
            <Link href="/register" className="text-[#00537d] font-bold hover:underline">
              Kayıt Ol
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}