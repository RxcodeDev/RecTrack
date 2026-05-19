'use client';

import { useEffect, useRef, useState } from "react";
import type { StatsContent } from "@/lib/content";

interface Stat {
  target: number;
  suffix: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  className: "w-6 h-6",
  "aria-hidden": true,
} as const;

const defaultStats: Stat[] = [
  {
    target: 1000,
    suffix: "+",
    label: "Proyectos Entregados",
    description: "Presencia nacional.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3l9 5-9 5-9-5 9-5z" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M3 13l9 5 9-5" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    target: 98,
    suffix: "%",
    label: "Retención de Clientes",
    description: "Vuelven porque funciona.",
    icon: (
      <svg {...iconProps}>
        <path d="M4 11a8 8 0 0114-5l2 2M20 13a8 8 0 01-14 5l-2-2" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 4v4h-4M4 20v-4h4" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    target: 5,
    suffix: "★",
    label: "Calificación Promedio",
    description: "En cada servicio.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9L12 3z" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    target: 7,
    suffix: "+",
    label: "Años de Experiencia",
    description: "Oficio comprobado.",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" stroke="var(--color-brand-primary)" strokeWidth="2" />
        <path d="M12 7v5l3.5 2" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      else setCount(target);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, target, duration]);

  return count;
}

function StatItem({
  stat,
  index,
  active,
  visible,
}: {
  stat: Stat;
  index: number;
  active: boolean;
  visible: boolean;
}) {
  const count = useCountUp(stat.target, 2000, active);

  return (
    <div
      className="group relative pt-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${index * 0.12}s, transform 0.7s ease ${index * 0.12}s`,
      }}
    >
      {/* Top hairline + index */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ backgroundColor: "var(--color-border)" }}
      />
      <div
        className="absolute top-0 left-0 h-0.5 w-10 group-hover:w-full transition-all duration-700 ease-out"
        style={{ backgroundColor: "var(--color-brand-primary)" }}
      />

      <div className="flex items-center justify-between mb-6">
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "var(--color-muted)",
            letterSpacing: "0.1em",
          }}
        >
          0{index + 1}
        </span>
        <span className="transition-transform duration-500 group-hover:scale-110">
          {stat.icon}
        </span>
      </div>

      <div className="flex items-end gap-0.5 mb-3">
        <span
          className="tabular-nums leading-none"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 5.5vw, 4.5rem)",
            fontWeight: 800,
            color: "var(--color-text)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {count}
        </span>
        <span
          className="leading-none mb-1"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
            fontWeight: 800,
            color: "var(--color-brand-primary)",
            lineHeight: 1,
          }}
        >
          {stat.suffix}
        </span>
      </div>

      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.05rem",
          fontWeight: 700,
          color: "var(--color-text)",
          letterSpacing: "-0.01em",
        }}
      >
        {stat.label}
      </h3>
      <p
        className="mt-1.5"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.85rem",
          fontWeight: 400,
          color: "var(--color-muted)",
          lineHeight: 1.6,
        }}
      >
        {stat.description}
      </p>
    </div>
  );
}

export default function Stats({ data }: { data?: StatsContent }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const stats = defaultStats.map((s, i) => ({
    ...s,
    ...(data?.items[i] ? { target: data.items[i].target, suffix: data.items[i].suffix, label: data.items[i].label, description: data.items[i].description } : {}),
  }));
  const sectionLabel = data?.sectionLabel ?? "Por Qué ReckTrack";
  const heading = data?.heading ?? "Los números no mienten. Los nuestros hablan fuerte.";

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setTimeout(() => setActive(true), 300);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stats"
      className="py-28 overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={sectionRef}>
        {/* Header */}
        <div
          className="max-w-2xl mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5" style={{ backgroundColor: "var(--color-brand-primary)" }} />
            <span
              className="text-xs uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                color: "var(--color-brand-primary)",
                letterSpacing: "0.18em",
              }}
            >
              {sectionLabel}
            </span>
          </div>
          <h2
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
        </div>

        {/* Stats — editorial numbered grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14">
          {stats.map((stat, i) => (
            <StatItem
              key={stat.label}
              stat={stat}
              index={i}
              active={active}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
