'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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

function VideoTile({
  src, poster, client, category, desc, duration, delay = 0, visible,
  orientation = "horizontal", featured = false, tagline, stretch = false,
}: {
  src: string; poster: string; client: string; category: string; desc: string;
  duration: string; delay?: number; visible: boolean;
  orientation?: "horizontal" | "vertical"; featured?: boolean; tagline?: string; stretch?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const isVertical = orientation === "vertical";
  const tileH = stretch ? "100%" : isVertical ? 340 : featured ? 390 : 220;

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else { v.play(); setPlaying(true); }
  };

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
      {/* Real video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        preload="none"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />

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

      {/* Center play/pause */}
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

export default function Portfolio() {
  const { ref, visible } = useScrollReveal();
  const { ref: ref2, visible: visible2 } = useScrollReveal();

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
                Trabajo Selecto
              </span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--color-text)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Trabajo que <span style={{ color: "var(--color-brand-primary)" }}>se gana la atención.</span>
            </h2>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--color-muted)", lineHeight: 1.7, maxWidth: "22rem" }}>
            Proyectos reales para clientes reales — branding, web, foto y video que generan resultados.
          </p>
        </div>

        {/* ── FOTO GRID — editorial layout ──────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4" style={{ gridAutoRows: "280px" }}>
          {/* Featured tall — left */}
          <div className="md:col-span-5 row-span-2" style={{
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s",
          }}>
            <PhotoTile
              img="https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&q=80"
              client="IDAM Arte" category="Identidad de Marca"
              desc="Branding integral para galería de arte contemporáneo."
              visible={visible} tall={true}
            />
          </div>
          {/* Top right */}
          <div className="md:col-span-4" style={{
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.12s, transform 0.6s ease 0.12s",
          }}>
            <PhotoTile
              img="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80"
              client="Makeup Artist Glory" category="Serie Fotográfica"
              desc="Look-book para artista de maquillaje profesional."
              visible={visible}
            />
          </div>
          {/* Top far right */}
          <div className="md:col-span-3" style={{
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.18s, transform 0.6s ease 0.18s",
          }}>
            <PhotoTile
              img="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
              client="SH Curly Store" category="Fotografía de Producto"
              desc="E-commerce y redes."
              visible={visible}
            />
          </div>
          {/* Bottom middle */}
          <div className="md:col-span-4" style={{
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.24s, transform 0.6s ease 0.24s",
          }}>
            <PhotoTile
              img="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
              client="TeraFitness" category="Campaña Digital"
              desc="Estrategia y campañas para fisioterapia."
              visible={visible}
            />
          </div>
          {/* Bottom far right */}
          <div className="md:col-span-3" style={{
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
          }}>
            <PhotoTile
              img="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80"
              client="Dental White" category="Desarrollo Web"
              desc="Sitio web clínica dental."
              visible={visible}
            />
          </div>
        </div>

        {/* ── VIDEO SECTION ─────────────────────────────────── */}
        <div ref={ref2} className="mt-10 mb-4">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-5"
            style={{ opacity: visible2 ? 1 : 0, transition: "opacity 0.6s ease" }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#EF5350", boxShadow: "0 0 6px #EF5350" }} />
            <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.7rem", color: "var(--color-brand-primary)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Producción Audiovisual
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
          </div>

          {/* Row 1: 1 wide horizontal (7 cols) + 3 vertical reels (5 cols) */}
          <div className="grid grid-cols-12 gap-3 mb-3" style={{ alignItems: "stretch" }}>
            <div className="col-span-12 md:col-span-7"
              style={{ opacity: visible2 ? 1 : 0, transform: visible2 ? "none" : "translateY(20px)", transition: "opacity 0.5s ease 0.05s, transform 0.5s ease 0.05s" }}>
              <VideoTile
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                poster="https://images.unsplash.com/photo-1574717024453-354056afd6fc?w=800&q=80"
                client="Bolis Purileo" category="Spot Publicitario"
                desc="Campaña audiovisual para lanzamiento de producto." duration="2:34"
                visible={visible2} orientation="horizontal" featured
                tagline="Contenido que conecta marcas con personas reales."
              />
            </div>
            <div className="col-span-12 md:col-span-5 grid grid-cols-3 gap-3" style={{ alignItems: "stretch" }}>
              {[
                { src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", poster: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80", client: "Makeup Artist Glory", category: "Reel", desc: "Transformación para Instagram.", duration: "0:28", delay: 0.1, tagline: "El antes y después que enamora." },
                { src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", poster: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80", client: "ALUI Holística", category: "Story", desc: "Contenido vertical de marca.", duration: "0:45", delay: 0.16, tagline: "Bienestar en cada frame." },
                { src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", poster: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80", client: "TeraFitness", category: "Reel", desc: "Tips de fisioterapia.", duration: "0:52", delay: 0.22, tagline: "Mueve tu marca con propósito." },
              ].map((v) => (
                <div key={v.client} className="h-full" style={{ opacity: visible2 ? 1 : 0, transform: visible2 ? "none" : "translateY(20px)", transition: `opacity 0.5s ease ${v.delay}s, transform 0.5s ease ${v.delay}s` }}>
                  <VideoTile src={v.src} poster={v.poster} client={v.client} category={v.category}
                    desc={v.desc} duration={v.duration} visible={visible2} orientation="vertical"
                    featured tagline={v.tagline} stretch />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: 3 horizontal videos — featured */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", poster: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=700&q=80", client: "Dr. René Dentista", category: "Video Institucional", desc: "Presentación corporativa para clínica dental.", duration: "1:48", delay: 0.12, tagline: "Tu clínica, vista por miles de pacientes nuevos." },
              { src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", poster: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80", client: "TeraFitness", category: "Testimonial", desc: "Testimoniales en video de pacientes.", duration: "3:12", delay: 0.18, tagline: "Resultados reales que inspiran confianza." },
              { src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", poster: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=700&q=80", client: "SH Curly Store", category: "Review de Producto", desc: "Video review para canal de YouTube.", duration: "4:05", delay: 0.24, tagline: "Productos que brillan frente a cámara." },
            ].map((v) => (
              <div key={v.client} style={{ opacity: visible2 ? 1 : 0, transform: visible2 ? "none" : "translateY(20px)", transition: `opacity 0.5s ease ${v.delay}s, transform 0.5s ease ${v.delay}s` }}>
                <VideoTile src={v.src} poster={v.poster} client={v.client} category={v.category}
                  desc={v.desc} duration={v.duration} visible={visible2} orientation="horizontal"
                  featured tagline={v.tagline} />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center" style={{ opacity: visible2 ? 1 : 0, transition: "opacity 0.7s ease 0.5s" }}>
          <button
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl border transition-all duration-300 hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem", color: "var(--color-text)", borderColor: "var(--color-border-soft)", backgroundColor: "var(--color-surface)" }}
          >
            Ver Portafolio Completo
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="var(--color-brand-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}
