// BU DOSYA SUNUCU TARAFINDA ÇALIŞIR
// use client YOKTUR

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// İçeriği diğer dosyadan çağırıyoruz
import ProfileContent from "../../components/ProfileContent";

export default function ProfilePage() {
  return <ProfileContent />;
}