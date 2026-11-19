import type { Metadata } from "next";
import {
  Dosis,
  Geist,
  Geist_Mono,
  Great_Vibes,
  Love_Light,
  Lovers_Quarrel,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// const dosis = localFont({
//   src: [
//     {
//       path: "../public/fonts/LoversQuarrel-Regular.ttf",
//       weight: "400",
//       style: "normal"
//     }
//   ]
// })

// const dosis = Great_Vibes({
//   subsets: ['latin'],
//   weight: '400', // Solo tiene un peso
//   variable: '--font-great-vibes',
//   display: 'swap',
// });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coso x Cosi",
  description: "Lo que me tiene haciendo el amor... ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${geistSans.variable} ${geistMono.variable} antialiased bg-[#e8e4e3]`}
      >
        <div className="bg-[#e8e4e3] flex justify-center items-center flex-col">
          <div className="shadow-2xl">{children}</div>
        </div>
      </body>
    </html>
  );
}
