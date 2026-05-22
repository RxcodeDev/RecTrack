'use client';

import { useEffect, useRef, useState } from "react";
import type { StatsContent } from "@/lib/content";

interface Stat {
  target: number;
  suffix: string;
  label: string;
  description: string;
  icon: string;
}

const STAT_ICON_PATHS: Record<string, React.ReactNode> = {
  users:     <><circle cx="7" cy="6" r="2.5" stroke="#B71C1C" strokeWidth="1.6"/><path d="M1 17c0-3 2.5-5 6-5" stroke="#B71C1C" strokeWidth="1.6" strokeLinecap="round"/><circle cx="13" cy="6" r="2.5" stroke="#B71C1C" strokeWidth="1.6"/><path d="M13 12c3.5 0 6 2 6 5" stroke="#B71C1C" strokeWidth="1.6" strokeLinecap="round"/></>,
  calendar:  <><rect x="2" y="4" width="16" height="13" rx="2" stroke="#B71C1C" strokeWidth="1.6"/><path d="M6 2v4M14 2v4M2 9h16" stroke="#B71C1C" strokeWidth="1.6" strokeLinecap="round"/></>,
  star:      <path d="M10 2l2 4.9 5.4.8-3.9 3.8.9 5.3L10 14.2l-4.8 2.6.9-5.3L2.2 7.7l5.4-.8L10 2z" stroke="#B71C1C" strokeWidth="1.6" strokeLinejoin="round"/>,
  smile:     <><circle cx="10" cy="10" r="8" stroke="#B71C1C" strokeWidth="1.6"/><path d="M7 12.5s1.2 1.5 3 1.5 3-1.5 3-1.5" stroke="#B71C1C" strokeWidth="1.6" strokeLinecap="round"/><circle cx="7.5" cy="8.5" r="1" fill="#B71C1C"/><circle cx="12.5" cy="8.5" r="1" fill="#B71C1C"/></>,
  chart:     <><rect x="2" y="12" width="4" height="5" rx="1" stroke="#B71C1C" strokeWidth="1.6"/><rect x="8" y="8" width="4" height="9" rx="1" stroke="#B71C1C" strokeWidth="1.6"/><rect x="14" y="4" width="4" height="13" rx="1" stroke="#B71C1C" strokeWidth="1.6"/></>,
  briefcase: <><rect x="2" y="7" width="16" height="10" rx="2" stroke="#B71C1C" strokeWidth="1.6"/><path d="M7 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="#B71C1C" strokeWidth="1.6"/><path d="M2 12h16" stroke="#B71C1C" strokeWidth="1.6"/></>,
  target:    <><circle cx="10" cy="10" r="8" stroke="#B71C1C" strokeWidth="1.6"/><circle cx="10" cy="10" r="4" stroke="#B71C1C" strokeWidth="1.6"/><circle cx="10" cy="10" r="1.5" fill="#B71C1C"/></>,
  award:     <><circle cx="10" cy="7" r="5" stroke="#B71C1C" strokeWidth="1.6"/><path d="M6.5 11.5L5 18l5-3 5 3-1.5-6.5" stroke="#B71C1C" strokeWidth="1.6" strokeLinejoin="round"/></>,
  rocket:    <path d="M10 2s4 1 5.5 6L12 12H8L4.5 8C6 3 10 2 10 2z" stroke="#B71C1C" strokeWidth="1.6" strokeLinejoin="round"/>,
  globe:     <><circle cx="10" cy="10" r="8" stroke="#B71C1C" strokeWidth="1.6"/><path d="M2 10h16M10 2a14 14 0 0 1 0 16M10 2a14 14 0 0 0 0 16" stroke="#B71C1C" strokeWidth="1.6"/></>,
  heart:     <path d="M10 16s-7-4-7-9a4 4 0 0 1 7-2.5A4 4 0 0 1 17 7c0 5-7 9-7 9z" stroke="#B71C1C" strokeWidth="1.6" strokeLinejoin="round"/>,
  lightning: <path d="M12 2L6 11h5l-3 7 9-10h-5l3-6z" stroke="#B71C1C" strokeWidth="1.6" strokeLinejoin="round"/>,
};

function StatIcon({ iconKey }: { iconKey: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6" aria-hidden="true">
      {STAT_ICON_PATHS[iconKey] ?? STAT_ICON_PATHS.star}
    </svg>
  );
}

const defaultStats: Stat[] = [
  { target: 1000, suffix: "+", label: "Proyectos Entregados",  description: "Presencia nacional.",        icon: "briefcase" },
  { target: 98,   suffix: "%", label: "Retención de Clientes", description: "Vuelven porque funciona.",   icon: "users"     },
  { target: 5,    suffix: "★", label: "Calificación Promedio", description: "En cada servicio.",         icon: "star"      },
  { target: 7,    suffix: "+", label: "Años de Experiencia",   description: "Oficio comprobado.",        icon: "calendar"  },
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
        style={{ backgroundColor: "#B71C1C" }}
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
          <StatIcon iconKey={stat.icon} />
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
            color: "#B71C1C",
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
  const stats = data
    ? data.items.map((item, i) => ({
        ...(defaultStats[i] ?? defaultStats[0]),
        target: item.target,
        suffix: item.suffix,
        label: item.label,
        description: item.description,
        icon: item.icon ?? defaultStats[i]?.icon ?? "star",
      }))
    : defaultStats;
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
            <div className="w-8 h-0.5" style={{ backgroundColor: "#B71C1C" }} />
            <span
              className="text-xs uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                color: "#B71C1C",
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
            {heading.split('. ').map((part, i, arr) => i === arr.length - 1 ? <span key={i} style={{ color: "#B71C1C" }}>{part}</span> : <span key={i}>{part}. </span>)}
          </h2>
        </div>

        {/* Stats — editorial numbered grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14">
          {stats.map((stat, i) => (
            <StatItem
              key={i}
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
