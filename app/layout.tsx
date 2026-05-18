import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Space_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReckTrack Marketing Digital — Construimos Marcas que se Mueven",
  description:
    "ReckTrack MD es una agencia de marketing digital integral especializada en desarrollo web, producción audiovisual, fotografía y campañas de marketing estratégico.",
  keywords: [
    "marketing digital",
    "desarrollo web",
    "estrategia de marca",
    "fotografía",
    "audiovisual",
    "campañas de marketing",
    "ReckTrack",
  ],
  openGraph: {
    title: "ReckTrack Marketing Digital",
    description: "Impulsamos marcas que generan cambios.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${outfit.variable} ${spaceMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-white text-brand-text antialiased font-body">
        {children}
      </body>
    </html>
  );
}
