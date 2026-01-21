// DİKKAT: En üstte "use client" YOK. Bu bir sunucu dosyasıdır.

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Az önce oluşturduğun içeriği buradan çağırıyoruz
import FavoritesContent from "../../components/FavoritesContent";

export default function FavoritesPage() {
  return <FavoritesContent />;
}