export default function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-gray-100 text-center">
      <p className="text-xs text-gray-400 mb-2">
        © 2026 Gerzegen Kitap. Tüm hakları saklıdır.
      </p>
      <div className="flex items-center justify-center gap-1 text-sm text-gray-500 font-medium">
        <span>Designed & Developed by</span>
        <a 
          href="https://www.mindversedesign.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#00537d] hover:text-[#004263] hover:underline font-bold transition"
        >
          Mindverse Design
        </a>
      </div>
    </footer>
  );
}