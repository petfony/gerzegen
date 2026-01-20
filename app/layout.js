import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Gerzegen Dashboard",
  description: "E-Book Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </head>
      {/* DEĞİŞİKLİK BURADA: bg-[#FDF0DE] -> bg-[#F3F4F6] oldu */}
      <body className={`${poppins.variable} font-poppins bg-[#F3F4F6] text-[#202020] h-screen overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}