import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Whatsapp from "./components/whatsapp/whatsapp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Importonyperu",
  description: "Importaciones y Negociaciones Tony E.I.R.L.",
  keywords: ["Importony", "importaciones Tony", "tony peru"],
  icons: {
    icon: "/images/importonyIcon.ico"
  },
  openGraph: {
    title: 'Importonyperu',
    description: 'Importaciones y Negociaciones Tony E.I.R.L.',
    url: 'https://importonyperu.com.pe',
    siteName: "Importonyperu",
    images: [
      {
        url: 'https://importonyperu.com.pe/importony_miniatura.png',
        width: 1200,
        height: 630,
        alt: 'Imagen de vista previa',
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} `}>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        <Whatsapp />
      </body>
    </html>
  );
}
