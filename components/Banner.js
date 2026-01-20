// components/Banner.js
export default function Banner() {
  return (
    <div className="w-full bg-[#00537d] rounded-3xl p-8 text-white flex items-center justify-between shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-2">Hoş Geldin, Deniz</h1>
        <p className="opacity-80">Kaldığın yerden devam et: Satranç</p>
      </div>
      <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-10"></div>
    </div>
  );
}