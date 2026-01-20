import Sidebar from "../../../components/Sidebar";
import BookInteractionManager from "../../../components/BookInteractionManager";
import Footer from "../../../components/Footer";
import BookActions from "../../../components/BookActions"; 
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export const revalidate = 0;

// --- 1. SEO: DİNAMİK METADATA (Google Başlığı ve Açıklaması) ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  const { data: book } = await supabase.from('books').select('title, description, cover').eq('slug', slug).single();

  if (!book) return { title: 'Kitap Bulunamadı' };

  return {
    title: `${book.title} Oku | Gerzegen Kütüphanesi`,
    description: book.description ? book.description.slice(0, 160) : 'Bu kitabı Gerzegen kütüphanesinde ücretsiz oku.',
    openGraph: {
      title: book.title,
      description: book.description,
      images: [book.cover], // Sosyal medyada paylaşınca kapak çıksın
    },
  };
}

export default async function BookDetail({ params }) {
  const { slug } = await params;

  // VERİLERİ ÇEK
  const { data: book, error: bookError } = await supabase.from('books').select('*').eq('slug', slug).single();
  if (bookError || !book) return notFound();

  const { data: versions } = await supabase.from('book_versions').select('name, type').eq('book_id', book.id).order('id', { ascending: true });

  const formatText = (text) => {
    if (!text) return null;
    return text.split('**').map((part, index) => 
      index % 2 === 1 ? <strong key={index} className="font-black text-black">{part}</strong> : part
    );
  };

  // --- 2. SEO: JSON-LD (Schema.org Yapısal Veri) ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: book.author,
    },
    description: book.description,
    image: book.cover,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: book.rating || 5, // Puan yoksa 5 varsayalım hata vermesin
      bestRating: "5",
      worstRating: "1",
      ratingCount: "1" // Şimdilik 1 varsayıyoruz
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 flex flex-col md:flex-row w-full overflow-hidden">
            
            {/* SOL KOLON */}
            <div className="w-full md:w-2/5 h-full overflow-y-auto border-r border-gray-100 bg-[#FAFAFA] shrink-0 scrollbar-hide">
               
               <div className="w-full relative bg-white border-b border-gray-100 shadow-sm group" style={{ aspectRatio: '1/1' }}>
                   {book.cover ? (
                       <img src={book.cover} alt={book.title} className="w-full h-full object-cover block"/>
                   ) : (
                       <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-400">
                          <span className="material-icons text-5xl mb-2">image_not_supported</span>
                          <span className="text-xs font-bold uppercase tracking-widest">Kapak Yok</span>
                       </div>
                   )}
                   <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full text-[#00537d] font-bold text-xs hover:bg-white transition shadow-lg z-10 uppercase tracking-widest">
                      <span className="material-icons text-sm">arrow_back</span> GERİ DÖN
                   </Link>
               </div>

               <div className="p-10">
                  <h3 className="font-black text-[#202020] text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <span className="w-8 h-0.5 bg-[#00537d]"></span> YAZAR HAKKINDA
                  </h3>
                  <p className="text-sm text-gray-600 mb-10 leading-relaxed font-medium text-justify hyphens-auto whitespace-pre-wrap">
                      {formatText(book.author_bio)}
                  </p>
               </div>
            </div>

            {/* SAĞ KOLON */}
            <div className="w-full md:w-3/5 p-12 md:p-20 flex flex-col h-full overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-3 mb-6">
                 <div className="flex items-center gap-1 bg-[#00537d] text-white px-3 py-1 rounded-full shadow-md shadow-[#00537d]/20">
                    <span className="material-icons text-xs">star</span>
                    <span className="text-xs font-bold">{book.rating}</span>
                 </div>
                 <span className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">{book.category}</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-[#202020] mb-4 tracking-tighter leading-[0.9]">{book.title}</h1>
              <p className="text-2xl text-gray-300 mb-12 font-light tracking-tight">by <span className="text-gray-500 font-bold">{book.author}</span></p>

              <div className="mb-16">
                <h3 className="font-black text-[#202020] text-xs uppercase tracking-[0.2em] mb-6 pb-2 border-b-2 border-gray-100 w-max">AÇIKLAMA</h3>
                <div className="text-gray-600 leading-relaxed text-xl font-medium text-justify hyphens-auto whitespace-pre-wrap">
                    {formatText(book.description)}
                </div>
              </div>
              
              <BookInteractionManager bookId={book.id} />

              <div className="mt-10 mb-16">
                <h3 className="font-black text-[#202020] text-xs uppercase tracking-[0.2em] mb-6">VERSİYON SEÇ VE OKU</h3>
                <BookActions versions={versions} bookSlug={book.slug} />
              </div>
            </div>
        </div>
        
        <div className="shrink-0 bg-white z-20 relative border-t border-gray-100">
             <Footer />
        </div>

        {/* --- 3. SEO: SCRİPT EKLENDİ --- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

      </main>
    </div>
  );
}