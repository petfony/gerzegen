export const dynamic = 'force-dynamic';
export const revalidate = 0;

// İŞTE DÜZELTME BURADA: (Başında iki nokta var, dikkat et)
import Sidebar from "../components/Sidebar"; 
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default async function Home({ searchParams }) {
  const params = await searchParams; 
  const search = params?.q || "";

  let query = supabase.from('books').select('*').order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data: books } = await query;

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="p-8 md:p-12 h-full overflow-y-auto custom-scrollbar">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black text-[#202020] tracking-tighter mb-2">KÜTÜPHANE</h1>
              <p className="text-gray-400 font-medium text-sm">
                Toplam <span className="text-[#00537d] font-bold">{books?.length || 0}</span> kitap listeleniyor.
              </p>
            </div>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-20">
            {books?.map((book) => (
              <Link key={book.id} href={`/books/${book.slug}`} className="group block">
                <div className="relative aspect-[2/3] mb-4 overflow-hidden rounded-sm bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                  {book.cover ? (
                    <img 
                      src={book.cover} 
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <span className="material-icons text-4xl">image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[#00537d]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-bold tracking-widest text-xs border border-white/30 px-4 py-2 rounded-full">İNCELE</span>
                  </div>
                </div>
                <h3 className="font-bold text-[#202020] text-sm leading-tight mb-1 truncate group-hover:text-[#00537d] transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-400 font-medium truncate">
                  {book.author}
                </p>
              </Link>
            ))}

            {books?.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-300">
                <span className="material-icons text-6xl mb-4">search_off</span>
                <p className="text-lg font-medium">Aradığınız kriterde kitap bulunamadı.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}