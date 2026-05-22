'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { PortfolioContent } from "@/lib/content";

function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function PhotoTile({
  img, client, category, desc, delay = 0, visible, tall = false,
}: { img: string; client: string; category: string; desc: string; delay?: number; visible: boolean; tall?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${tall ? "row-span-2" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        minHeight: tall ? "100%" : "280px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image src={img} alt={`${client} — ${category}`} fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }} />
      <div className="absolute top-4 left-4 z-10">
        <span className="inline-block px-2.5 py-1 rounded-full text-white text-xs backdrop-blur-md"
          style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", backgroundColor: "rgba(183,28,28,0.85)" }}>
          {category}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{client}</p>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", color: "#fff", lineHeight: 1.2 }}>{desc}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(6px)", transition: "all 0.3s ease" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>Ver proyecto</span>
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
}

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

function VideoTile({
  src, poster, client, category, desc, duration, delay = 0, visible,
  orientation = "horizontal", featured = false, tagline, stretch = false,
}: {
  src: string; poster: string; client: string; category: string; desc: string;
  duration: string; delay?: number; visible: boolean;
  orientation?: "horizontal" | "vertical"; featured?: boolean; tagline?: string; stretch?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const isVertical = orientation === "vertical";
  const tileH = stretch ? "100%" : isVertical ? 340 : featured ? 390 : 220;
  const youtubeId = getYouTubeId(src);
  const posterSrc = poster || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : "");

  const toggle = () => setPlaying(p => !p);

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
        width: "100%",
        height: tileH,
      }}
      onClick={toggle}
    >
      {/* Poster image — always shown when not playing */}
      {posterSrc && !playing && (
        <img
          src={posterSrc}
          alt={`${client} — ${category}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      )}

      {/* Media — only mounted on play click to avoid preload errors */}
      {playing && (
        youtubeId ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ border: 0 }}
          />
        ) : src ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            autoPlay
            muted
            playsInline
            loop
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={src} />
          </video>
        ) : null
      )}

      {/* Overlay — featured uses full-coverage gradient */}
      {featured
        ? <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.75) 100%)" }} />
        : <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" }} />
      }
      <div className="absolute inset-x-0 top-0 h-px" style={{ backgroundColor: "rgba(183,28,28,0.5)" }} />

      {/* Top row: category + duration */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
        <span className="inline-block px-2.5 py-0.5 rounded-full text-white backdrop-blur-md"
          style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", backgroundColor: "rgba(183,28,28,0.85)" }}>
          {category}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full backdrop-blur-md"
          style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.9)", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: playing ? "#EF5350" : "rgba(255,255,255,0.45)", display: "inline-block" }} />
          {duration}
        </span>
      </div>

      {/* Featured: editorial tagline block in the upper area */}
      {featured && tagline && (
        <div className="absolute top-12 left-4 right-4 z-10">
          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: isVertical ? "1rem" : "1.55rem",
            lineHeight: 1.25, color: "#fff",
            textShadow: "0 2px 18px rgba(0,0,0,0.55)",
          }}>{tagline}</p>
          {!isVertical && (
            <div className="flex items-center gap-3 mt-3">
              {[
                { label: "Alcance", value: "180K" },
                { label: "Engagement", value: "12.4%" },
                { label: "Conversiones", value: "3.2×" },
              ].map(s => (
                <div key={s.label} className="px-2.5 py-1 rounded-lg backdrop-blur-md"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
                  <p style={{ fontFamily: "var(--font-mono,monospace)", fontSize: "0.82rem", fontWeight: 700, color: "#fff" }}>{s.value}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.5rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Center play/pause — hidden when YouTube iframe is active */}
      {!(youtubeId && playing) && (
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div
          className="flex items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110"
          style={{
            width: isVertical ? 44 : 52, height: isVertical ? 44 : 52,
            backgroundColor: playing ? "rgba(183,28,28,0.9)" : "rgba(255,255,255,0.18)",
            border: "1.5px solid rgba(255,255,255,0.35)",
            backdropFilter: "blur(6px)",
          }}>
          {playing
            ? <svg viewBox="0 0 20 20" fill="none" width="16" height="16"><rect x="4" y="3" width="4" height="14" rx="1" fill="white"/><rect x="12" y="3" width="4" height="14" rx="1" fill="white"/></svg>
            : <svg viewBox="0 0 20 20" fill="none" width="16" height="16"><path d="M6 4l12 6-12 6V4z" fill="white"/></svg>
          }
        </div>
      </div>
      )}

      {/* Progress bar */}
      <div className="absolute inset-x-0 bottom-0 h-[3px]" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
        <div className="h-full transition-all duration-300" style={{ width: playing ? "35%" : "0%", backgroundColor: "#EF5350" }} />
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-3 left-3 right-3 z-10">
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>{client}</p>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: isVertical ? "0.8rem" : "0.92rem", color: "#fff", lineHeight: 1.2 }}>{desc}</h3>
      </div>
    </div>
  );
}

export default function Portfolio({ data }: { data?: PortfolioContent }) {
  const { ref, visible } = useScrollReveal();
  const { ref: ref2, visible: visible2 } = useScrollReveal();
  const sectionLabel = data?.sectionLabel ?? "Trabajo Selecto";
  const ctaLabel = data?.ctaLabel ?? "Ver Portafolio Completo";
  const photos = data?.photos ?? [];
  const videos = data?.videos ?? [];
  const rawHeading = data?.heading;
  const heading: string[] = Array.isArray(rawHeading) && rawHeading.length
    ? rawHeading
    : typeof rawHeading === "string" && rawHeading
    ? [rawHeading]
    : ["Trabajo que", "se gana la atención."];

  return (
    <section id="portfolio" className="py-24" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div ref={ref} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5" style={{ backgroundColor: "var(--color-brand-primary)" }} />
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.75rem", color: "var(--color-brand-primary)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {sectionLabel}
              </span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--color-text)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              {heading.slice(0, -1).join(" ")}{heading.length > 1 && heading[0] ? " " : ""}<span style={{ color: "var(--color-brand-primary)" }}>{heading[heading.length - 1]}</span>
            </h2>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--color-muted)", lineHeight: 1.7, maxWidth: "22rem" }}>
            Proyectos reales para clientes reales — branding, web, foto y video que generan resultados.
          </p>
        </div>

        {/* ── FOTO GRID — editorial layout ──────────────────── */}
        {photos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4" style={{ gridAutoRows: "280px" }}>
          {/* Featured tall — left */}
          {photos[0] && (
          <div className="md:col-span-5 row-span-2" style={{
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s",
          }}>
            <PhotoTile
              img={photos[0].img} client={photos[0].client} category={photos[0].category}
              desc={photos[0].desc} visible={visible} tall={true}
            />
          </div>
          )}
          {/* Top right */}
          {photos[1] && (
          <div className="md:col-span-4" style={{
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.12s, transform 0.6s ease 0.12s",
          }}>
            <PhotoTile
              img={photos[1].img} client={photos[1].client} category={photos[1].category}
              desc={photos[1].desc} visible={visible}
            />
          </div>
          )}
          {/* Top far right */}
          {photos[2] && (
          <div className="md:col-span-3" style={{
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.18s, transform 0.6s ease 0.18s",
          }}>
            <PhotoTile
              img={photos[2].img} client={photos[2].client} category={photos[2].category}
              desc={photos[2].desc} visible={visible}
            />
          </div>
          )}
          {/* Bottom middle */}
          {photos[3] && (
          <div className="md:col-span-4" style={{
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.24s, transform 0.6s ease 0.24s",
          }}>
            <PhotoTile
              img={photos[3].img} client={photos[3].client} category={photos[3].category}
              desc={photos[3].desc} visible={visible}
            />
          </div>
          )}
          {/* Bottom far right */}
          {photos[4] && (
          <div className="md:col-span-3" style={{
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
          }}>
            <PhotoTile
              img={photos[4].img} client={photos[4].client} category={photos[4].category}
              desc={photos[4].desc} visible={visible}
            />
          </div>
          )}
        </div>
        )}

        {/* ── VIDEO SECTION ─────────────────────────────────── */}
        <div ref={ref2}>
        {videos.length > 0 && (() => {
          const hVideos = videos.filter(v => (v.orientation ?? "horizontal") === "horizontal");
          const vVideos = videos.filter(v => v.orientation === "vertical");
          return (
          <div className="mt-10 mb-4">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6"
              style={{ opacity: visible2 ? 1 : 0, transition: "opacity 0.6s ease" }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#EF5350", boxShadow: "0 0 6px #EF5350" }} />
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.7rem", color: "var(--color-brand-primary)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Producción Audiovisual
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
            </div>

            {/* ── Landscape: TV · Web · Cine ── */}
            {hVideos.length > 0 && (
            <div className="mb-8">
              <div className={`grid gap-4 ${hVideos.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                {hVideos.map((v, i) => (
                  <div key={`h-${i}`} className="relative w-full overflow-hidden rounded-2xl"
                    style={{
                      aspectRatio: "16/9",
                      opacity: visible2 ? 1 : 0,
                      transform: visible2 ? "none" : "translateY(20px)",
                      transition: `opacity 0.55s ease ${0.15 + i * 0.1}s, transform 0.55s ease ${0.15 + i * 0.1}s`,
                    }}>
                    <VideoTile src={v.src} poster={v.poster ?? ""}
                      client={v.client} category={v.category}
                      desc={v.desc} duration={v.duration}
                      visible orientation="horizontal" featured tagline={v.tagline} stretch />
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* ── Portrait: Reels · Stories · Móvil ── */}
            {vVideos.length > 0 && (
            <div>
              <div className={`grid gap-3 ${
                vVideos.length === 1 ? "grid-cols-1 max-w-xs" :
                vVideos.length === 2 ? "grid-cols-2 md:grid-cols-2" :
                vVideos.length === 3 ? "grid-cols-3" :
                "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              }`}>
                {vVideos.map((v, i) => (
                  <div key={`v-${i}`} className="relative w-full overflow-hidden rounded-2xl"
                    style={{
                      aspectRatio: "9/16",
                      opacity: visible2 ? 1 : 0,
                      transform: visible2 ? "none" : "translateY(20px)",
                      transition: `opacity 0.55s ease ${0.2 + i * 0.08}s, transform 0.55s ease ${0.2 + i * 0.08}s`,
                    }}>
                    <VideoTile src={v.src} poster={v.poster ?? ""}
                      client={v.client} category={v.category}
                      desc={v.desc} duration={v.duration}
                      visible orientation="vertical" featured tagline={v.tagline} stretch />
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>
          );
        })()}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center" style={{ opacity: visible2 ? 1 : 0, transition: "opacity 0.7s ease 0.5s" }}>
          <a
            href="/portafolio"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl border transition-all duration-300 hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem", color: "var(--color-text)", borderColor: "var(--color-border-soft)", backgroundColor: "var(--color-surface)", textDecoration: "none" }}
          >
            {ctaLabel}
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="var(--color-brand-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
