import { supabase } from "../lib/supabase";

export default async function sitemap() {
  // Canlıdaysak o adresi al, yoksa localhost'u kullan
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const { data: books } = await supabase.from('books').select('slug, created_at');

  const bookUrls = books
    ? books.map((book) => ({
        url: `${BASE_URL}/books/${book.slug}`,
        lastModified: new Date(book.created_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    : [];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...bookUrls,
  ];
}