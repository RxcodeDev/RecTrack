import { promises as fs } from "fs";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "data", "site-content.json");
const LOGOS_PATH = path.join(process.cwd(), "data", "site-logos.json");

export interface SiteLogos {
  logo_url?: string;
  favicon_url?: string;
}

export async function readLogos(): Promise<SiteLogos> {
  try {
    const raw = await fs.readFile(LOGOS_PATH, "utf-8");
    return JSON.parse(raw) as SiteLogos;
  } catch {
    return {};
  }
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface MetaContent {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robots: string;
  twitterCard: "summary" | "summary_large_image";
  twitterSite: string;
}

export interface NavbarContent {
  whatsappNumber: string;
  whatsappMessage: string;
}

export interface HeroContent {
  eyebrow: string;
  headline: string[];
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trustStats: { value: string; label: string }[];
}

export interface ClientItem {
  name: string;
  src: string;
}
export interface ClientsContent {
  label: string;
  items: ClientItem[];
}

export interface ServiceItem {
  title: string;
  description: string;
  detail: string;
  image: string;
}
export interface ServicesContent {
  sectionLabel: string;
  heading: string;
  items: ServiceItem[];
}

export interface StatItem {
  target: number;
  suffix: string;
  label: string;
  description: string;
}
export interface StatsContent {
  sectionLabel: string;
  heading: string;
  items: StatItem[];
}

export interface PhotoItem {
  img: string;
  client: string;
  category: string;
  desc: string;
}
export interface VideoItem {
  src: string;
  poster: string;
  client: string;
  category: string;
  desc: string;
  duration: string;
  featured: boolean;
  tagline: string;
  orientation: "horizontal" | "vertical";
}
export interface PortfolioContent {
  sectionLabel: string;
  heading: string;
  ctaLabel: string;
  photos: PhotoItem[];
  videos: VideoItem[];
}

export interface VideoTestimonialItem {
  id: string;
  kind: "youtube" | "vimeo" | "file";
  src: string;
  poster?: string;
  name: string;
  role: string;
}
export interface GoogleReviewItem {
  author: string;
  initials: string;
  avatarBg: string;
  rating: number;
  timeAgo: string;
  text: string;
}
export interface TestimonialsContent {
  sectionLabel: string;
  heading: string;
  videos: VideoTestimonialItem[];
  googleSummary: { rating: number; total: number };
  googleMapsUrl: string;
  googleReviews: GoogleReviewItem[];
}

export interface ContactContent {
  sectionLabel: string;
  heading: string;
  subtext: string;
  email: string;
  phone: string;
  location: string;
}

export interface FooterContent {
  tagline: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  location: string;
  social: { facebook: string; tiktok: string; instagram: string };
  legalLinks: { label: string; href: string }[];
}

export interface SiteContent {
  meta: MetaContent;
  navbar: NavbarContent;
  hero: HeroContent;
  clients: ClientsContent;
  services: ServicesContent;
  stats: StatsContent;
  portfolio: PortfolioContent;
  testimonials: TestimonialsContent;
  contact: ContactContent;
  footer: FooterContent;
}

// ── Read / Write ─────────────────────────────────────────────────────────────

export async function readContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export async function writeContent(data: SiteContent): Promise<void> {
  await fs.writeFile(CONTENT_PATH, JSON.stringify(data, null, 2), "utf-8");
}

/** Partially update a top-level section. */
export async function patchSection<K extends keyof SiteContent>(
  section: K,
  patch: Partial<SiteContent[K]>
): Promise<SiteContent> {
  const content = await readContent();
  content[section] = { ...content[section], ...patch } as SiteContent[K];
  await writeContent(content);
  return content;
}
