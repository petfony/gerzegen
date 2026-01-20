import { supabase } from "../../../lib/supabase";
import { notFound } from "next/navigation"; 
import ClientReader from "./ClientReader";

export default async function ReaderPage({ params, searchParams }) {
  const { slug } = await params;
  const { v: versionType } = await searchParams;

  // NOT: BURADAKİ GÜVENLİK KONTROLÜNÜ KALDIRDIK.
  // KONTROLÜ ClientReader İÇİNDE YAPACAĞIZ.

  // 1. KİTABI BUL
  const { data: book } = await supabase.from('books').select('id, title').eq('slug', slug).single();
  if (!book) return notFound();

  // 2. İÇERİĞİ BUL
  const { data: versionData } = await supabase
    .from('book_versions')
    .select('content, name')
    .eq('book_id', book.id)
    .eq('type', versionType)
    .single();

  return (
    <ClientReader 
      bookTitle={book.title} 
      versionName={versionData?.name || versionType} 
      content={versionData?.content} 
      slug={slug}
    />
  );
}