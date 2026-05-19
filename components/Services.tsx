'use client';

import { useEffect, useRef, useState } from "react";
import type { ServicesContent } from "@/lib/content";

interface Service {
  title: string;
  description: string;
  detail: string;
  image: string;
  icon: React.ReactNode;
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  className: "w-7 h-7",
  "aria-hidden": true,
} as const;

const defaultServices: Service[] = [
  {
    title: "Desarrollo Web",
    description: "Sitios y apps rápidos, hechos para convertir.",
    detail: "Desarrollos a medida y e-commerce con tecnología moderna.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
    icon: (
      <svg {...iconProps}>
        <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" stroke="var(--color-brand-coral)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Contenido Audiovisual",
    description: "Video y storytelling que detiene el scroll.",
    detail: "Producción de video, reels y cobertura de eventos.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="6" width="13" height="12" rx="2" stroke="var(--color-brand-coral)" strokeWidth="2" />
        <path d="M16 10l5-3v10l-5-3v-4z" stroke="var(--color-brand-coral)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Fotografía",
    description: "Imágenes que comunican tu marca.",
    detail: "Sesiones de producto, editoriales y eventos.",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=80",
    icon: (
      <svg {...iconProps}>
        <path d="M4 8h3l2-2h6l2 2h3v11H4V8z" stroke="var(--color-brand-coral)" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3.5" stroke="var(--color-brand-coral)" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Campañas de Marketing",
    description: "Estrategias que generan resultados.",
    detail: "Medios pagados, SEO y analítica en un solo lugar.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
    icon: (
      <svg {...iconProps}>
        <path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-6M20 16v-2" stroke="var(--color-brand-coral)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function useScrollReveal() {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function ServiceCard({
  service,
  index,
  visible,
}: {
  service: Service;
  index: number;
  visible: boolean;
}) {
  return (
    <article
      className="group relative h-[28rem] rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
      style={{
        boxShadow: "0 2px 16px rgba(0,0,0,0.45)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s, box-shadow 0.4s ease, translate 0.4s ease`,
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-100 group-hover:scale-110 transition-transform duration-[1.2s] ease-out"
        style={{ backgroundImage: `url(${service.image})` }}
      />

      {/* Base gradient so the title is always legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(15,15,15,0.85) 0%, rgba(15,15,15,0.35) 45%, rgba(15,15,15,0.1) 100%)",
        }}
      />

      {/* Red top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 z-20"
        style={{ backgroundColor: "var(--color-brand-primary)" }}
      />

      {/* Title — always visible at the bottom */}
      <div className="absolute inset-x-0 bottom-0 p-7 z-10 transition-transform duration-500 group-hover:-translate-y-2">
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.45rem",
            fontWeight: 800,
            color: "var(--color-on-brand)",
            lineHeight: 1.15,
            textShadow: "0 2px 12px rgba(0,0,0,0.6)",
          }}
        >
          {service.title}
        </h3>
        <div
          className="mt-3 h-0.5 w-10 group-hover:w-16 transition-all duration-500"
          style={{ backgroundColor: "var(--color-brand-primary)" }}
        />
      </div>

      {/* Glass info panel — revealed on hover */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-center px-7 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
        style={{
          background: "rgba(20,20,20,0.45)",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{
            background: "color-mix(in srgb, var(--color-brand-primary) 18%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-brand-coral) 35%, transparent)",
          }}
        >
          {service.icon}
        </div>
        <h3
          className="mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.4rem",
            fontWeight: 800,
            color: "var(--color-on-brand)",
            lineHeight: 1.15,
          }}
        >
          {service.title}
        </h3>
        <p
          className="mb-3"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "var(--color-on-brand)",
            lineHeight: 1.5,
          }}
        >
          {service.description}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.85rem",
            fontWeight: 400,
            color: "rgba(255,255,255,0.78)",
            lineHeight: 1.7,
          }}
        >
          {service.detail}
        </p>

        <div className="mt-6 flex items-center gap-1.5">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.875rem",
              color: "var(--color-brand-coral)",
            }}
          >
            Saber más
          </span>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="var(--color-brand-coral)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </article>
  );
}

export default function Services({ data }: { data?: ServicesContent }) {
  const { ref, visible } = useScrollReveal();
  const services = defaultServices.map((s, i) => ({
    ...s,
    ...(data?.items[i] ? { title: data.items[i].title, description: data.items[i].description, detail: data.items[i].detail, image: data.items[i].image } : {}),
  }));
  const sectionLabel = data?.sectionLabel ?? "Lo Que Hacemos";
  const heading = data?.heading ?? "Todo lo que necesitas. Una sola agencia.";

  return (
    <section id="services" className="py-24" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section header */}
        <div
          ref={ref}
          className="max-w-2xl mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5" style={{ backgroundColor: "var(--color-brand-primary)" }} />
            <span
              className="text-xs uppercase tracking-widest font-body"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                color: "var(--color-brand-primary)",
                letterSpacing: "0.15em",
              }}
            >
              {sectionLabel}
            </span>
          </div>

          <h2
            className="font-display mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "var(--color-text)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {heading.split('. ').map((part, i, arr) => i === arr.length - 1 ? <span key={i} style={{ color: "var(--color-brand-primary)" }}>{part}</span> : <span key={i}>{part}. </span>)}
          </h2>

          <p
            className="font-body"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.05rem",
              fontWeight: 400,
              color: "var(--color-muted)",
              lineHeight: 1.75,
            }}
          >
            Desde el primer clic hasta la conversión final, ReckTrack MD gestiona
            cada dimensión de tu presencia digital con calidad sin concesiones.
          </p>
        </div>

        {/* Cards grid: 1 → 2 → 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
