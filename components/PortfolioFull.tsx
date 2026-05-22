'use client';

import { useState } from "react";
import Image from "next/image";
import type { PortfolioPageContent } from "@/lib/content";

/* ── helpers ─────────────────────────────────────────────────── */

function getYouTubeId(src: string): string | null {
  if (!src) return null;
  const patterns = [
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = src.match(p);
    if (m) return m[1];
  }
  return null;
}

/* ── Section divider ─────────────────────────────────────────── */

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: "#EF5350", boxShadow: "0 0 6px #EF5350" }} />
      <span style={{
        fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.68rem",
        color: "var(--color-brand-primary)", letterSpacing: "0.15em", textTransform: "uppercase",
      }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
    </div>
  );
}

/* ── WebsiteTile ─────────────────────────────────────────────── */

function WebsiteTile({ url, screenshot, client, category, desc }: {
  url: string; screenshot: string; client: string; category: string; desc: string;
}) {
  const [hovered, setHovered] = useState(false);
  const hostname = (() => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; } })();

  return (
    <a
      href={url} target="_blank" rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl"
      style={{
        textDecoration: "none",
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-surface)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.18)" : "0 2px 8px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Browser chrome bar */}
      <div className="flex items-center gap-2 px-3 py-2.5"
        style={{ borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}>
        <div className="flex gap-1.5 flex-shrink-0">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#febc2e" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#28c840" }} />
        </div>
        <div className="flex-1 flex items-center gap-1.5 rounded-md px-2 py-0.5"
          style={{ backgroundColor: "rgba(0,0,0,0.06)", maxWidth: "100%", overflow: "hidden" }}>
          <svg viewBox="0 0 16 16" fill="none" width="10" height="10" style={{ flexShrink: 0 }}>
            <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" style={{ color: "var(--color-muted)" }}/>
            <path d="M8 3v10M2 7h12" stroke="currentColor" strokeWidth="1.4" style={{ color: "var(--color-muted)" }}/>
          </svg>
          <span style={{
            fontFamily: "monospace", fontSize: "0.62rem", color: "var(--color-muted)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {hostname}
          </span>
        </div>
        {/* External link icon — shows on hover */}
        <svg viewBox="0 0 16 16" fill="none" width="13" height="13" style={{
          flexShrink: 0, color: "var(--color-brand-primary)",
          opacity: hovered ? 1 : 0, transition: "opacity 0.2s ease",
        }}>
          <path d="M10 2h4v4M6 10l8-8M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Screenshot */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {screenshot && (screenshot.startsWith("/") || screenshot.startsWith("http")) ? (
          <Image src={screenshot} alt={`${client} — ${desc}`} fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" }}>
            <svg viewBox="0 0 48 48" fill="none" width="40" height="40">
              <rect x="6" y="8" width="36" height="28" rx="3" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
              <path d="M2 40h44" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18 40l3-4h6l3 4" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.55) 100%)" }} />
      </div>

      {/* Info */}
      <div className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 rounded-full mb-2"
              style={{
                fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.56rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                backgroundColor: "rgba(183,28,28,0.12)", color: "var(--color-brand-primary)",
              }}>
              {category}
            </span>
            <p style={{
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.65rem",
              color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.08em",
              marginBottom: 4,
            }}>
              {client}
            </p>
            <p style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem",
              color: "var(--color-text)", lineHeight: 1.3,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {desc}
            </p>
          </div>
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: hovered ? "var(--color-brand-primary)" : "var(--color-border)",
              transform: hovered ? "rotate(-45deg)" : "rotate(0deg)",
            }}>
            <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
              <path d="M3 8h10M9 4l4 4-4 4" stroke={hovered ? "#fff" : "var(--color-muted)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ── VideoTile ───────────────────────────────────────────────── */

function VideoTile({ src, poster, client, category, desc, duration }: {
  src: string; poster: string; client: string; category: string;
  desc: string; duration: string;
}) {
  const [playing, setPlaying] = useState(false);
  const youtubeId = getYouTubeId(src);
  const posterSrc = poster || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : "");

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl cursor-pointer group"
      onClick={() => setPlaying(true)}>
      {playing ? (
        youtubeId ? (
          <iframe src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media" allowFullScreen
            className="absolute inset-0 w-full h-full border-0" title={desc} />
        ) : (
          <video src={src} autoPlay controls className="absolute inset-0 w-full h-full object-cover" />
        )
      ) : (
        <>
          {posterSrc && (posterSrc.startsWith("/") || posterSrc.startsWith("http")) ? (
            <Image src={posterSrc} alt={desc || client || "Video"} fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw" />
          ) : (
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" }} />
          )}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(160deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.7) 100%)" }} />
          <div className="absolute inset-x-0 top-0 h-px"
            style={{ backgroundColor: "rgba(183,28,28,0.5)" }} />

          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-white backdrop-blur-md"
              style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", backgroundColor: "rgba(183,28,28,0.85)" }}>
              {category}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full backdrop-blur-md"
              style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.9)", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.45)", display: "inline-block" }} />
              {duration}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{client}</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: "#fff", lineHeight: 1.25 }}>{desc}</p>
          </div>

          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md"
              style={{ backgroundColor: "rgba(183,28,28,0.9)", boxShadow: "0 0 20px rgba(183,28,28,0.5)" }}>
              <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── PhotoTile ───────────────────────────────────────────────── */

function PhotoTile({ img, client, category, desc }: {
  img: string; client: string; category: string; desc: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl cursor-pointer group"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Image src={img} alt={`${client} — ${category}`} fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw" />
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }} />
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-block px-2.5 py-1 rounded-full text-white backdrop-blur-md"
          style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", backgroundColor: "rgba(183,28,28,0.85)" }}>
          {category}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{client}</p>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.95rem", color: "#fff", lineHeight: 1.2 }}>{desc}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(6px)", transition: "all 0.3s ease" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "rgba(255,255,255,0.8)" }}>Ver proyecto</span>
          <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────── */

type Filter = "todo" | "web" | "video" | "foto";

export default function PortfolioFull({ data }: { data: PortfolioPageContent }) {
  const { pageTitle, pageDescription, photos = [], videos = [], websites = [],
    tabAll = "Todo", tabWeb = "Sitios Web", tabVideo = "Video", tabPhoto = "Fotografía",
    labelWeb = "Sitios Web", labelVideoH = "Video — TV · Web · Cine",
    labelVideoV = "Video — Reels · Stories · Móvil", labelPhoto = "Fotografía",
  } = data;
  const [filter, setFilter] = useState<Filter>("todo");

  const hVideos = videos.filter(v => (v.orientation ?? "horizontal") === "horizontal");
  const vVideos = videos.filter(v => v.orientation === "vertical");

  const showW = filter === "todo" || filter === "web";
  const showV = filter === "todo" || filter === "video";
  const showP = filter === "todo" || filter === "foto";

  const hasContent = websites.length > 0 || videos.length > 0 || photos.length > 0;

  const FILTERS: { key: Filter; label: string; count: number }[] = [
    { key: "todo",  label: tabAll,   count: websites.length + videos.length + photos.length },
    { key: "web",   label: tabWeb,   count: websites.length },
    { key: "video", label: tabVideo, count: videos.length },
    { key: "foto",  label: tabPhoto, count: photos.length },
  ];

  return (
    <section className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)", paddingTop: "6rem", paddingBottom: "5rem" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

        {/* Back + Header */}
        <div className="mb-10">
          <a href="/" className="inline-flex items-center gap-1.5 mb-6 transition-colors"
            style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--color-muted)", textDecoration: "none" }}>
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Inicio
          </a>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "var(--color-text)", lineHeight: 1.1, marginBottom: "0.75rem" }}>
            {pageTitle || "Portafolio"}
          </h1>
          {pageDescription && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--color-muted)", maxWidth: "44rem", lineHeight: 1.7 }}>
              {pageDescription}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <button key={f.key} type="button" onClick={() => setFilter(f.key)}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm transition-all duration-200 cursor-pointer"
                style={
                  active
                    ? { fontFamily: "var(--font-body)", fontWeight: 600, backgroundColor: "var(--color-brand-primary)", color: "#fff", border: "1px solid var(--color-brand-primary)" }
                    : { fontFamily: "var(--font-body)", fontWeight: 500, backgroundColor: "transparent", color: "var(--color-muted)", border: "1px solid var(--color-border)" }
                }>
                {f.label}
                {f.count > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[0.6rem] font-bold"
                    style={{ backgroundColor: active ? "rgba(255,255,255,0.25)" : "var(--color-border)", color: active ? "#fff" : "var(--color-muted)" }}>
                    {f.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Sitios Web ─────────────────────────────── */}
        {showW && websites.length > 0 && (
          <div className="mb-14">
            <SectionLabel label={labelWeb} />
            <div className={`grid gap-6 ${
              websites.length === 1 ? "grid-cols-1 max-w-2xl" :
              websites.length === 2 ? "grid-cols-1 md:grid-cols-2" :
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}>
              {websites.map((w, i) => (
                <WebsiteTile key={i} url={w.url} screenshot={w.screenshot}
                  client={w.client} category={w.category} desc={w.desc} />
              ))}
            </div>
          </div>
        )}

        {/* ── Video horizontal ───────────────────────── */}
        {showV && hVideos.length > 0 && (
          <div className="mb-12">
            <SectionLabel label={labelVideoH} />
            <div className={`grid gap-5 ${hVideos.length === 1 ? "grid-cols-1 max-w-2xl" : "grid-cols-1 md:grid-cols-2"}`}>
              {hVideos.map((v, i) => (
                <div key={i} className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16/9" }}>
                  <VideoTile src={v.src} poster={v.poster ?? ""} client={v.client}
                    category={v.category} desc={v.desc} duration={v.duration} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Video vertical ─────────────────────────── */}
        {showV && vVideos.length > 0 && (
          <div className="mb-12">
            <SectionLabel label={labelVideoV} />
            <div className={`grid gap-4 ${
              vVideos.length === 1 ? "grid-cols-1 max-w-xs" :
              vVideos.length === 2 ? "grid-cols-2" :
              vVideos.length <= 4  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" :
              "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            }`}>
              {vVideos.map((v, i) => (
                <div key={i} className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "9/16" }}>
                  <VideoTile src={v.src} poster={v.poster ?? ""} client={v.client}
                    category={v.category} desc={v.desc} duration={v.duration} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Fotografía ─────────────────────────────── */}
        {showP && photos.length > 0 && (
          <div className="mb-12">
            <SectionLabel label={labelPhoto} />
            <div className={`grid gap-4 ${
              photos.length === 1 ? "grid-cols-1 max-w-lg" :
              photos.length === 2 ? "grid-cols-1 sm:grid-cols-2" :
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}>
              {photos.map((p, i) => (
                <div key={i} className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "4/3" }}>
                  <PhotoTile img={p.img} client={p.client} category={p.category} desc={p.desc} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasContent && (
          <div className="flex flex-col items-center justify-center py-24 gap-4"
            style={{ color: "var(--color-muted)" }}>
            <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
              <rect x="6" y="10" width="36" height="26" rx="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M19 21l10 5-10 5V21z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>Sin contenido todavía.</p>
          </div>
        )}

      </div>
    </section>
  );
}
