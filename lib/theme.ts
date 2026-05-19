import { promises as fs } from "fs";
import path from "path";

// Tema gestionado desde Rxpanel: TODOS los colores de marca/UI viven aquí
// (no hardcodeados en componentes ni en globals.css). Cada clave se inyecta
// como variable CSS `--color-<clave>` en el layout y la consumen tanto los
// componentes (var(--color-*)) como Tailwind (tailwind.config.ts).

const THEME_PATH = path.join(process.cwd(), "data", "site-theme.json");

// Orden = orden en que se muestran en el panel.
export const COLOR_KEYS = [
  // Marca
  "brand-primary",
  "brand-accent",
  "brand-deep",
  "brand-glow",
  "brand-light",
  "brand-bright",
  "brand-coral",
  "brand-subtle",
  // CTA WhatsApp
  "whatsapp",
  "whatsapp-bright",
  // Superficies y texto
  "bg",
  "surface",
  "raised",
  "high",
  "text",
  "on-brand",
  "ink",
  // UI semitransparente (acepta rgba/hex; editable como texto)
  "border",
  "border-soft",
  "muted",
  "dim",
  "faint",
  "brand-red-bg",
  "brand-red-border",
  "bg-overlay",
  "scrollbar-track",
] as const;

export type ColorKey = (typeof COLOR_KEYS)[number];
export type SiteColors = Record<ColorKey, string>;

export interface SiteLogos {
  logo_url: string;
  favicon_url: string;
}

export interface SiteTheme {
  colors: SiteColors;
  logos: SiteLogos;
}

// Valores por defecto = identidad de marca actual. Si el JSON no existe o le
// falta una clave, se usa este valor (la web nunca se queda sin color).
export const DEFAULT_COLORS: SiteColors = {
  "brand-primary": "#B71C1C",
  "brand-accent": "#D32F2F",
  "brand-deep": "#7F0000",
  "brand-glow": "#EF5350",
  "brand-light": "#C62828",
  "brand-bright": "#FF5252",
  "brand-coral": "#FF6B6B",
  "brand-subtle": "#F8EEEE",
  whatsapp: "#15A148",
  "whatsapp-bright": "#25D366",
  bg: "#F8F7F5",
  surface: "#FFFFFF",
  raised: "#F0EEEC",
  high: "#E5E3E0",
  text: "#0D0D0D",
  "on-brand": "#FFFFFF",
  ink: "#2A2A2A",
  border: "rgba(0,0,0,0.08)",
  "border-soft": "rgba(0,0,0,0.14)",
  muted: "rgba(0,0,0,0.50)",
  dim: "rgba(0,0,0,0.35)",
  faint: "rgba(0,0,0,0.04)",
  "brand-red-bg": "rgba(183,28,28,0.08)",
  "brand-red-border": "rgba(183,28,28,0.25)",
  "bg-overlay": "rgba(248,247,245,0.96)",
  "scrollbar-track": "#E8E8E8",
};

const DEFAULT_THEME: SiteTheme = {
  colors: DEFAULT_COLORS,
  logos: {
    logo_url: "/logos/transparente.png",
    favicon_url: "/favicon.ico",
  },
};

export async function readTheme(): Promise<SiteTheme> {
  try {
    const raw = await fs.readFile(THEME_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<SiteTheme>;
    return {
      colors: { ...DEFAULT_COLORS, ...(parsed.colors ?? {}) },
      logos: { ...DEFAULT_THEME.logos, ...(parsed.logos ?? {}) },
    };
  } catch {
    return DEFAULT_THEME;
  }
}

async function writeTheme(theme: SiteTheme): Promise<void> {
  await fs.mkdir(path.dirname(THEME_PATH), { recursive: true });
  await fs.writeFile(THEME_PATH, JSON.stringify(theme, null, 2), "utf-8");
}

export async function patchColors(patch: Partial<SiteColors>): Promise<SiteColors> {
  const theme = await readTheme();
  theme.colors = { ...theme.colors, ...patch };
  await writeTheme(theme);
  return theme.colors;
}

export async function patchLogos(patch: Partial<SiteLogos>): Promise<SiteLogos> {
  const theme = await readTheme();
  theme.logos = { ...theme.logos, ...patch };
  await writeTheme(theme);
  return theme.logos;
}

/** CSS `--color-<clave>: <valor>;` para inyectar en :root. */
export function colorsToCssVars(colors: SiteColors): string {
  return Object.entries(colors)
    .map(([k, v]) => `--color-${k}:${v};`)
    .join("");
}
