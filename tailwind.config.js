/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // Eğer özel renkler tanımlamak istersen buraya ekleyebilirsin
      // ama şimdilik gerek yok, kodun içinde hex kodu (#00537d) kullandık.
    },
  },
  plugins: [],
};