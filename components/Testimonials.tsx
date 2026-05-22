'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import type { TestimonialsContent, VideoTestimonialItem } from "@/lib/content";

/* ─────────────────────────────────────────────────────────────
   1. VIDEOS VERTICALES (carrusel)
   Reemplaza los `src` por tus URLs reales.
   - kind: "youtube"  -> usa la URL embed: https://www.youtube.com/embed/VIDEO_ID
   - kind: "vimeo"    -> usa la URL embed: https://player.vimeo.com/video/VIDEO_ID
   - kind: "file"     -> URL directa a un .mp4 (CDN). Puedes añadir `poster`.
   ───────────────────────────────────────────────────────────── */
type VideoKind = "youtube" | "vimeo" | "file";

interface VideoTestimonial {
  id: string;
  kind: VideoKind;
  src: string;
  poster?: string;
  name: string;
  role: string;
}

const defaultVideoTestimonials: VideoTestimonialItem[] = [
  {
    id: "v1",
    kind: "youtube",
    src: "https://www.youtube.com/embed/REEMPLAZAR_ID_1",
    name: "Carolina Ferreira",
    role: "Directora de Marketing · Meridian Finance",
  },
  {
    id: "v2",
    kind: "youtube",
    src: "https://www.youtube.com/embed/REEMPLAZAR_ID_2",
    name: "James Oduya",
    role: "Fundador y CEO · Volta Spirits",
  },
  {
    id: "v3",
    kind: "youtube",
    src: "https://www.youtube.com/embed/REEMPLAZAR_ID_3",
    name: "Sofía Marchetti",
    role: "Directora Creativa · Aurae Botanicals",
  },
  {
    id: "v4",
    kind: "youtube",
    src: "https://www.youtube.com/embed/REEMPLAZAR_ID_4",
    name: "Diego Salazar",
    role: "Gerente de Crecimiento · Lumen Co.",
  },
];

/* ─────────────────────────────────────────────────────────────
   2. RESEÑAS DE GOOGLE (snapshot manual)
   Copia aquí las reseñas reales del perfil. Actualiza también
   `googleSummary` con el rating y total reales del negocio.
   Perfil: RecTrack Marketing Digital
   ───────────────────────────────────────────────────────────── */
const DEFAULT_GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/RecTrack+Marketing+Digital/@20.6392532,-103.4172459,17z/data=!4m6!3m5!1s0x8428b11b3c6f2a37:0x2fad2c1a8d9c65fe!8m2!3d20.6392532!4d-103.4172459!16s%2Fg%2F11j5_77vfk";

const defaultGoogleSummary = {
  rating: 5.0,
  total: 3,
};

interface GoogleReview {
  author: string;
  initials: string;
  avatarBg: string;
  rating: number;
  timeAgo: string;
  text: string;
}

const defaultGoogleReviews: GoogleReview[] = [
  {
    author: "David Hermida",
    initials: "DH",
    avatarBg: "#B71C1C",
    rating: 5,
    timeAgo: "Hace 6 años",
    text: "Excelente servicio, atención y seguimiento a tus redes sociales 😍",
  },
  {
    author: "Julio Cesar Lopez Cerdan",
    initials: "JC",
    avatarBg: "#7F0000",
    rating: 5,
    timeAgo: "Hace 6 años",
    text: "La mejor agencia de marketing, gracias por ayudarme a hacer crecer mi negocio con su servicio de publicidad en Guadalajara y Veracruz 👏🏻👏🏻👏🏻🌟🌟🌟🌟🌟",
  },
  {
    author: "Ismael Zav",
    initials: "IZ",
    avatarBg: "#D32F2F",
    rating: 5,
    timeAgo: "Hace 6 años",
    text: "Excelente atención y trabajo, personas sumamente responsables y profesionales recomendado sin duda alguna",
  },
];

/* ───────────────── Scroll reveal ───────────────── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ───────────────── Stars ───────────────── */
function StarRow({ count = 5, size = 16 }: { count?: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 16 16"
          fill={i < count ? "#FBBC04" : "rgba(255,255,255,0.18)"}
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: size, height: size }}
          aria-hidden="true"
        >
          <path d="M8 1.5l1.545 3.13 3.455.502-2.5 2.437.59 3.44L8 9.385l-3.09 1.624.59-3.44L3 5.132l3.455-.502L8 1.5z" />
        </svg>
      ))}
    </div>
  );
}

/* ───────────────── Reproductor de video vertical ───────────────── */
function VideoFrame({ video }: { video: VideoTestimonial }) {
  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-2xl"
      style={{
        aspectRatio: "9 / 16",
        backgroundColor: "#000",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      {video.kind === "file" ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={video.src}
          poster={video.poster}
          controls
          playsInline
          preload="metadata"
        />
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={video.src}
          title={`Testimonio de ${video.name}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      )}

      {/* Etiqueta inferior con nombre */}
      <div
        className="absolute inset-x-0 bottom-0 px-4 py-3 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        <p
          className="font-display text-white"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.95rem",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {video.name}
        </p>
        <p
          className="font-body"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.3,
          }}
        >
          {video.role}
        </p>
      </div>
    </div>
  );
}

/* ───────────────── Carrusel ───────────────── */
function VideoCarousel({ videos }: { videos: VideoTestimonialItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateButtons();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {videos.map((v) => (
          <div
            key={v.id}
            data-card
            className="snap-start flex-shrink-0"
            style={{ width: "min(280px, 75vw)" }}
          >
            <VideoFrame video={v} />
          </div>
        ))}
      </div>

      {/* Controles */}
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        disabled={!canPrev}
        aria-label="Anterior"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-opacity"
        style={{
          backgroundColor: "var(--color-surface)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          opacity: canPrev ? 1 : 0,
          pointerEvents: canPrev ? "auto" : "none",
        }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
          <path
            d="M15 6l-6 6 6 6"
            fill="none"
            stroke="var(--color-text)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        disabled={!canNext}
        aria-label="Siguiente"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-opacity"
        style={{
          backgroundColor: "var(--color-surface)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          opacity: canNext ? 1 : 0,
          pointerEvents: canNext ? "auto" : "none",
        }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
          <path
            d="M9 6l6 6-6 6"
            fill="none"
            stroke="var(--color-text)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

/* ───────────────── Logo de Google ───────────────── */
function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11 11 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/* ───────────────── Tarjeta de reseña ───────────────── */
function ReviewCard({ review }: { review: GoogleReview }) {
  return (
    <div
      className="flex flex-col rounded-2xl p-6 h-full"
      style={{
        backgroundColor: "var(--color-surface)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: review.avatarBg }}
          aria-hidden="true"
        >
          <span
            className="text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.04em",
            }}
          >
            {review.initials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-display truncate"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "var(--color-text)",
              lineHeight: 1.2,
            }}
          >
            {review.author}
          </p>
          <p
            className="font-body"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--color-muted)",
              lineHeight: 1.3,
            }}
          >
            {review.timeAgo}
          </p>
        </div>
        <div className="opacity-80" aria-hidden="true">
          <GoogleG />
        </div>
      </div>

      <div className="mb-3">
        <StarRow count={review.rating} size={15} />
      </div>

      <p
        className="font-body flex-1"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          color: "var(--color-muted)",
          lineHeight: 1.7,
        }}
      >
        {review.text}
      </p>
    </div>
  );
}

/* ───────────────── Sección ───────────────── */
export default function Testimonials({ data }: { data?: TestimonialsContent }) {
  const { ref, visible } = useScrollReveal();
  // Descarta entradas incompletas (p. ej. filas en blanco creadas en el panel):
  // un video sin `src` rompería el <iframe>/<video>.
  const videos = (data?.videos ?? defaultVideoTestimonials).filter(
    (v) => v.src.trim() !== ""
  );
  const reviews = data?.googleReviews ?? defaultGoogleReviews;
  const summary = data?.googleSummary ?? defaultGoogleSummary;
  const mapsUrl = data?.googleMapsUrl ?? DEFAULT_GOOGLE_MAPS_URL;
  const sectionLabel = data?.sectionLabel ?? "Testimonios";
  const heading = data?.heading ?? "Lo que nuestros clientes realmente dicen.";

  return (
    <section
      id="testimonials"
      className="py-14 overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div
          ref={ref}
          className="max-w-2xl mx-auto text-center mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-0.5" style={{ backgroundColor: "#B71C1C" }} />
            <span
              className="text-xs uppercase tracking-widest font-body"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                color: "#B71C1C",
                letterSpacing: "0.15em",
              }}
            >
              {sectionLabel}
            </span>
            <div className="w-8 h-0.5" style={{ backgroundColor: "#B71C1C" }} />
          </div>

          <h2
            className="font-display mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "var(--color-text)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Lo que nuestros clientes{" "}
            <span style={{ color: "#B71C1C" }}>{heading.includes('realmente') ? 'realmente dicen.' : heading}</span>
          </h2>

          <p
            className="font-body"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.05rem",
              color: "var(--color-muted)",
              lineHeight: 1.75,
            }}
          >
            Escúchalo directo de ellos en video — y mira las reseñas reales que
            dejaron en Google.
          </p>
        </div>

        {/* Bloque de reseñas de Google */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <GoogleG />
              <div>
                <p
                  className="font-display"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    lineHeight: 1.2,
                  }}
                >
                  Reseñas en Google
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="font-display"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      color: "var(--color-text)",
                    }}
                  >
                    {summary.rating.toFixed(1)}
                  </span>
                  <StarRow count={Math.round(summary.rating)} size={15} />
                  <span
                    className="font-body"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8rem",
                      color: "var(--color-muted)",
                    }}
                  >
                    ({summary.total} reseñas)
                  </span>
                </div>
              </div>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-display transition-transform hover:scale-[1.03]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "#fff",
                backgroundColor: "#B71C1C",
              }}
            >
              Ver todas en Google
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path
                  d="M7 17L17 7M17 7H8M17 7v9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 items-stretch">
            {reviews.map((r) => (
              <ReviewCard key={r.author} review={r} />
            ))}
          </div>
        </div>

        {/* Carrusel de videos verticales */}
        {videos.length > 0 && <VideoCarousel videos={videos} />}
      </div>
    </section>
  );
}
