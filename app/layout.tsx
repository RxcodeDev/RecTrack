import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Space_Mono } from "next/font/google";
import { promises as fs } from "fs";
import path from "path";
import "./globals.css";

async function getSiteColors(): Promise<Record<string, string>> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "site-colors.json"),
      "utf-8"
    );
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function getSiteMeta(): Promise<Record<string, unknown>> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "site-content.json"),
      "utf-8"
    );
    return (JSON.parse(raw) as { meta?: Record<string, unknown> }).meta ?? {};
  } catch {
    return {};
  }
}

async function getSiteLogos(): Promise<{ logo_url?: string; favicon_url?: string }> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "site-logos.json"),
      "utf-8"
    );
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSiteMeta();
  const logos = await getSiteLogos();
  const title = typeof meta.title === "string" ? meta.title : "ReckTrack Marketing Digital";
  const description = typeof meta.description === "string" ? meta.description : "";
  const ogTitle = typeof meta.ogTitle === "string" ? meta.ogTitle : title;
  const ogDescription = typeof meta.ogDescription === "string" ? meta.ogDescription : description;
  const ogImage = typeof meta.ogImage === "string" && meta.ogImage ? meta.ogImage : undefined;
  const keywords = Array.isArray(meta.keywords) ? (meta.keywords as string[]) : [];
  const robots = typeof meta.robots === "string" ? meta.robots : "index, follow";
  const canonical = typeof meta.canonicalUrl === "string" && meta.canonicalUrl ? meta.canonicalUrl : undefined;
  const twitterCard = (meta.twitterCard === "summary" ? "summary" : "summary_large_image") as "summary" | "summary_large_image";
  const twitterSite = typeof meta.twitterSite === "string" && meta.twitterSite ? meta.twitterSite : undefined;
  const favicon = logos.favicon_url || undefined;

  return {
    title,
    description,
    keywords,
    robots,
    alternates: canonical ? { canonical } : undefined,
    icons: favicon ? { icon: favicon, shortcut: favicon, apple: favicon } : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      locale: "es_ES",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }] : [],
    },
    twitter: {
      card: twitterCard,
      site: twitterSite,
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : [],
    },
  };
}

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


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const colors = await getSiteColors();
  const cssOverrides = Object.entries(colors)
    .map(([k, v]) => `--color-${k}:${v}`)
    .join(";");

  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${outfit.variable} ${spaceMono.variable} scroll-smooth`}
    >
      {cssOverrides && (
        <style>{`:root{${cssOverrides}}`}</style>
      )}
      <body className="min-h-screen bg-white text-brand-text antialiased font-body">
        {children}
      </body>
    </html>
  );
}
