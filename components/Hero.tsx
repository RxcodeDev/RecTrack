'use client';

import { useEffect, useState } from "react";
import type { HeroContent } from "@/lib/content";

const defaultHeadline = ["Impulsando", "marcas", "que", "generan", "cambios."];

const steps = [
  {
    title: "Nos conocemos",
    desc: "El primer punto de contacto: hablamos y rompemos el hielo.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3 19c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M17 9l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Compartes tus sueños",
    desc: "Nos cuentas tu visión, tu marca y a dónde quieres llegar.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path d="M12 3a6 6 0 0 0-3 11v3h6v-3a6 6 0 0 0-3-11z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M10 20h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Brainstorming",
    desc: "Sesión creativa: lluvia de ideas sin límites para tu proyecto.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Primera revisión",
    desc: "Revisamos juntos lo generado y afinamos el rumbo.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.7" />
        <path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Planeación",
    desc: "Estructuramos el plan de trabajo, tiempos y entregables.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <rect x="4" y="4" width="16" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 3v3M16 3v3M4 10h16M8 14h3M8 17h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Segunda revisión",
    desc: "Validamos cada detalle antes de pasar a ejecución.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path d="M5 13l4 4 10-11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 9l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Ejecución",
    desc: "Damos vida al proyecto con tecnología y creatividad.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Mostramos avances",
    desc: "Te presentamos el progreso en cada etapa, con transparencia.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M7 13l3-3 3 2 4-5M8 21h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Entregamos resultados",
    desc: "Entrega final del proyecto, listo para generar impacto.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path d="M3 7l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M3 7v8l9 4 9-4V7" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Proyecto al 100%",
    desc: "La satisfacción de ver tu proyecto cumplido y funcionando.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path d="M12 2l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 15.4 6.8 18.1l1-5.8L3.5 8.2l5.9-.9L12 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Hero({ data }: { data?: HeroContent }) {
  const headline = data?.headline ?? defaultHeadline;
  const eyebrow = data?.eyebrow ?? "Agencia Digital Integral";
  const ctaPrimary = data?.ctaPrimary ?? "Iniciar Proyecto";
  const trustStats = data?.trustStats ?? [
    { value: "50+", label: "Clientes" },
    { value: "7+",  label: "Años" },
    { value: "4",   label: "Servicios" },
    { value: "100%",label: "Satisfacción" },
  ];
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (paused) return;
    if (active >= steps.length - 1) return; // rest at the destination
    const id = setTimeout(() => setActive((i) => i + 1), 2200);
    return () => clearTimeout(id);
  }, [paused, active]);

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const step = steps[active];
  const isFinal = active === steps.length - 1;

  return (
    <section
      id="hero"
      className="relative h-[100svh] flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* ── Background: large red gradient wash ─────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 70% 50%, rgba(183,28,28,0.10) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle noise texture via repeating gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
        aria-hidden="true"
      />

      {/* Animated blob — bottom left */}
      <div
        className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(127,0,0,0.08) 0%, transparent 70%)",
          animationName:           mounted ? "floatBlob" : "none",
          animationDuration:       "15s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
          animationDirection:      "reverse",
          animationDelay:          "3s",
          animationFillMode:       "both",
        }}
        aria-hidden="true"
      />


      {/* ── Main content ──────────────────────────────────────────── */}
      {/* MOBILE: flex column, copy centered on top, orbital fills rest */}
      {/* DESKTOP: 2-col grid side by side */}
      <div className="relative z-10 flex flex-col flex-1 w-full">

        {/* ── MOBILE LAYOUT (hidden on lg+) ─────────────────────── */}
        <div className="flex flex-col flex-1 lg:hidden">

          {/* Copy block — distributed vertically */}
          <div className="flex flex-col items-center text-center px-6 justify-between"
            style={{ paddingTop: "calc(var(--navbar-h, 56px) + 16px)", paddingBottom: "16px", minHeight: "44svh" }}>

            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2"
              style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s" }}
            >
              <span
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border"
                style={{ borderColor: "var(--color-brand-red-border)", backgroundColor: "var(--color-brand-red-bg)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#B71C1C", boxShadow: "0 0 6px #B71C1C" }} />
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.65rem", color: "var(--color-brand-light)", letterSpacing: "0.18em", textTransform: "uppercase" }}>{eyebrow}</span>
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.85rem, 9vw, 2.6rem)", fontWeight: 800, color: "var(--color-text)", lineHeight: 1.06, letterSpacing: "-0.03em" }}
            >
              {headline.map((word, i) => (
                <span key={i} className="inline-block mr-[0.2em] last:mr-0"
                  style={mounted ? { animation: "fadeUp 0.6s ease forwards", animationDelay: `${0.2 + i * 0.1}s`, opacity: 0 } : { opacity: 0 }}
                >
                  {word === "cambios." ? <span style={{ color: "var(--color-brand-glow)" }}>{word}</span> : word}
                </span>
              ))}
            </h1>

            {/* CTA */}
            <button
              onClick={() => handleScrollTo("contact")}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", background: "linear-gradient(135deg, #B71C1C 0%, #7F0000 100%)", boxShadow: "0 4px 20px rgba(183,28,28,0.4)", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.5s ease 0.7s, transform 0.5s ease 0.7s" }}
            >
              {ctaPrimary}
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            {/* Stats row */}
            <div
              className="flex items-center justify-center gap-5 pt-3 border-t w-full"
              style={{ borderColor: "var(--color-border)", opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 1s" }}
            >
              {[
                { icon: <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5"><circle cx="7" cy="6" r="2.5" stroke="var(--color-brand-glow)" strokeWidth="1.6"/><path d="M1 17c0-3 2.5-5 6-5" stroke="var(--color-brand-glow)" strokeWidth="1.6" strokeLinecap="round"/><circle cx="13" cy="6" r="2.5" stroke="var(--color-brand-glow)" strokeWidth="1.6"/><path d="M13 12c3.5 0 6 2 6 5" stroke="var(--color-brand-glow)" strokeWidth="1.6" strokeLinecap="round"/></svg>, value: trustStats[0]?.value ?? "50+", label: trustStats[0]?.label ?? "Clientes" },
                { icon: <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5"><rect x="2" y="4" width="16" height="13" rx="2" stroke="var(--color-brand-glow)" strokeWidth="1.6"/><path d="M6 2v4M14 2v4M2 9h16" stroke="var(--color-brand-glow)" strokeWidth="1.6" strokeLinecap="round"/></svg>, value: trustStats[1]?.value ?? "7+", label: trustStats[1]?.label ?? "Años" },
                { icon: <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5"><path d="M10 2l2 4.9 5.4.8-3.9 3.8.9 5.3L10 14.2l-4.8 2.6.9-5.3L2.2 7.7l5.4-.8L10 2z" stroke="var(--color-brand-glow)" strokeWidth="1.6" strokeLinejoin="round"/></svg>, value: trustStats[2]?.value ?? "4", label: trustStats[2]?.label ?? "Servicios" },
                { icon: <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5"><circle cx="10" cy="10" r="8" stroke="var(--color-brand-glow)" strokeWidth="1.6"/><path d="M7 12.5s1.2 1.5 3 1.5 3-1.5 3-1.5" stroke="var(--color-brand-glow)" strokeWidth="1.6" strokeLinecap="round"/><circle cx="7.5" cy="8.5" r="1" fill="var(--color-brand-glow)"/><circle cx="12.5" cy="8.5" r="1" fill="var(--color-brand-glow)"/></svg>, value: trustStats[3]?.value ?? "100%", label: trustStats[3]?.label ?? "Satisfacción" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1">
                  <div className="flex-shrink-0">{s.icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9rem", color: "var(--color-text)", lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--color-dim)", letterSpacing: "0.08em", fontSize: "0.55rem", textTransform: "uppercase" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orbital — fills remaining space, perfectly centered */}
          <div
            className="flex-1 min-h-0 flex items-center justify-center"
            onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}
            style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 0.4s" }}
          >
            <div
              className="relative aspect-square"
              style={{ width: "min(88vw, calc(100svh - 280px))" }}
            >
              <svg viewBox="0 0 320 320" className="w-full h-full -rotate-90">
                <defs>
                  <linearGradient id="orbitGradMob" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2A2A2A" />
                    <stop offset="100%" stopColor="#0D0D0D" />
                  </linearGradient>
                </defs>
                <circle cx="160" cy="160" r="130" fill="none" stroke="var(--color-border-soft)" strokeWidth="1.5" strokeDasharray="1 9" strokeLinecap="round" />
                <circle
                  cx="160" cy="160" r="130" fill="none" stroke="url(#orbitGradMob)" strokeWidth="3.5" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 130}
                  strokeDashoffset={2 * Math.PI * 130 * (1 - active / (steps.length - 1))}
                  style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(0.33,1,0.68,1)", filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.25))", willChange: "stroke-dashoffset" }}
                />
                {steps.map((s, i) => {
                  const ang = (360 / steps.length) * i * (Math.PI / 180);
                  const cx = Number((160 + 130 * Math.cos(ang)).toFixed(3));
                  const cy = Number((160 + 130 * Math.sin(ang)).toFixed(3));
                  const done = i < active; const current = i === active;
                  return (
                    <g key={s.title} className="cursor-pointer" onClick={() => setActive(i)} style={{ transition: "all 0.4s ease" }}>
                      {(current || done) && (
                        <circle cx={cx} cy={cy} r={current ? 14 : 12} fill="none" stroke="#FF5252" strokeWidth="1" opacity="0.35" style={{ animation: "nodeAppear 0.3s ease 0.45s both" }}>
                          {current && (<><animate attributeName="r" from="14" to="26" dur="1.8s" begin="0.45s" repeatCount="indefinite" /><animate attributeName="opacity" from="0.45" to="0" dur="1.8s" begin="0.45s" repeatCount="indefinite" /></>)}
                        </circle>
                      )}
                      <circle cx={cx} cy={cy} r={current ? 14 : done ? 12 : 4.5}
                        fill={current ? "#FF5252" : done ? "#B71C1C" : "var(--color-surface)"}
                        stroke={current || done ? "transparent" : "var(--color-brand-red-border)"} strokeWidth="1.5"
                        style={{ transition: "r 0.3s cubic-bezier(0.34,1.56,0.64,1) 0.45s, fill 0.25s ease 0.45s", filter: current ? "drop-shadow(0 0 9px rgba(255,82,82,0.8))" : "none" }}
                      />
                      {(current || done) && (
                        <text x={cx} y={cy} transform={`rotate(90 ${cx} ${cy})`} textAnchor="middle" dominantBaseline="central"
                          style={{ fontFamily: "var(--font-display)", fontSize: current ? "13px" : "11px", fontWeight: 800, fill: "#fff", pointerEvents: "none", animation: "nodeAppear 0.3s ease 0.45s both" }}>
                          {i + 1}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="absolute left-1/2 top-1/2 rounded-full pointer-events-none" aria-hidden="true"
                style={{ width: "70%", height: "70%", transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(255,82,82,0.20) 0%, rgba(255,82,82,0.10) 35%, transparent 68%)", filter: "blur(24px)", animation: mounted ? "softGlow 5s ease-in-out infinite" : "none" }}
              />

              <div key={`mob-${active}`} className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none" style={{ padding: "0 18%" }}>
                <div className="flex items-center justify-center rounded-full"
                  style={{ width: isFinal ? "58px" : "68px", height: isFinal ? "58px" : "68px", marginBottom: isFinal ? "0.6rem" : "0.9rem", color: "#fff", background: "linear-gradient(135deg, #FF5252 0%, #B71C1C 50%, #7F0000 100%)", boxShadow: isFinal ? "0 0 32px rgba(255,82,82,0.6)" : "0 12px 28px rgba(127,0,0,0.40)", transition: "all 0.5s ease", animation: "stepIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.02s both" }}>
                  <div className={isFinal ? "scale-[1.3]" : "scale-[1.3]"}>{step.icon}</div>
                </div>
                <span className="font-display" style={{ fontFamily: "var(--font-display)", fontSize: "0.58rem", fontWeight: 800, color: "var(--color-dim)", letterSpacing: "0.25em", animation: "stepIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.09s both" }}>
                  {isFinal ? "META ALCANZADA" : `PASO ${String(active + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`}
                </span>
                <h3 className="font-display" style={{ fontFamily: "var(--font-display)", fontSize: isFinal ? "1.1rem" : "1.25rem", fontWeight: 800, color: isFinal ? "var(--color-brand-glow)" : "var(--color-text)", lineHeight: 1.1, letterSpacing: "-0.02em", marginTop: "0.4rem", animation: "stepIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.16s both" }}>
                  {step.title}
                </h3>
                <p className="font-body" style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 400, color: "var(--color-muted)", lineHeight: 1.45, marginTop: "0.35rem", animation: "stepIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.23s both" }}>
                  {step.desc}
                </p>
                {isFinal && (
                  <button onClick={() => handleScrollTo("contact")} className="group pointer-events-auto inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full"
                    style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #B71C1C 0%, #7F0000 100%)", boxShadow: "0 8px 22px rgba(183,28,28,0.5)", animation: "stepIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.3s both, ctaPulse 1.7s ease-in-out 1s infinite" }}>
                    Empezar mi proyecto
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT (hidden on mobile) ─────────────────── */}
        <div className="hidden lg:grid lg:grid-cols-[1.05fr_480px] lg:gap-14 lg:items-center flex-1 max-w-7xl mx-auto px-8 w-full pt-16">

          {/* ── Left: copy ────────────────────────────────────────── */}
          <div className="flex flex-col pt-1 pb-0 lg:justify-center lg:py-8">

            {/* Eyebrow pill */}
            <div
              className="inline-flex items-center gap-2 mb-2 lg:mb-6 self-start"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
              }}
            >
              <span
                className="inline-flex items-center gap-2 px-3 py-1 lg:px-4 lg:py-1.5 rounded-full border"
                style={{
                  borderColor: "var(--color-brand-red-border)",
                  backgroundColor: "var(--color-brand-red-bg)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#B71C1C", boxShadow: "0 0 6px #B71C1C" }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    fontSize: "0.68rem",
                    color: "var(--color-brand-light)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {eyebrow}
                </span>
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display mb-2 lg:mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.55rem, 7.5vw, 5.5rem)",
                fontWeight: 800,
                color: "var(--color-text)",
                lineHeight: 1.07,
                letterSpacing: "-0.03em",
                maxWidth: "13ch",
              }}
            >
              {headline.map((word, i) => (
                <span
                  key={i}
                  className="inline-block mr-[0.2em] last:mr-0"
                  style={
                    mounted
                      ? { animation: "fadeUp 0.6s ease forwards", animationDelay: `${0.2 + i * 0.1}s`, opacity: 0 }
                      : { opacity: 0 }
                  }
                >
                  {word === "cambios." ? (
                    <span style={{ color: "var(--color-brand-glow)" }}>{word}</span>
                  ) : word}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p
              className="font-body mb-4 lg:mb-9 hidden sm:block"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.05rem",
                fontWeight: 400,
                color: "var(--color-muted)",
                lineHeight: 1.7,
                maxWidth: "33rem",
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.6s ease 0.75s, transform 0.6s ease 0.75s",
              }}
            >
              ReckTrack MD combina estrategia, tecnología y creatividad para
              construir marcas digitales que destacan y generan resultados reales.
            </p>

            {/* CTAs */}
            <div
              className="flex gap-2 lg:gap-3 items-center mb-2 lg:mb-10"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.6s ease 0.95s, transform 0.6s ease 0.95s",
              }}
            >
              <button
                onClick={() => handleScrollTo("contact")}
                className="inline-flex items-center gap-2 px-5 py-2.5 lg:px-8 lg:py-4 rounded-xl font-display text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 active:translate-y-0"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(0.85rem, 3.5vw, 1.05rem)",
                  background: "linear-gradient(135deg, #B71C1C 0%, #7F0000 100%)",
                  boxShadow: "0 4px 24px rgba(183,28,28,0.4)",
                }}
              >
                {ctaPrimary}
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={() => handleScrollTo("portfolio")}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 lg:px-8 lg:py-4 rounded-xl font-display transition-all duration-200 hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "clamp(0.85rem, 3.5vw, 1.05rem)",
                  color: "var(--color-muted)",
                  border: "1px solid var(--color-border-soft)",
                  backgroundColor: "var(--color-faint)",
                }}
              >
                Ver Nuestro Trabajo
              </button>
            </div>

            {/* Trust bar */}
            <div
              className="grid grid-cols-4 lg:flex lg:flex-wrap gap-2 lg:gap-9 pt-2 lg:pt-7 border-t"
              style={{
                borderColor: "var(--color-border)",
                opacity: mounted ? 1 : 0,
                transition: "opacity 0.6s ease 1.2s",
              }}
            >
              {[
                {
                  icon: <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><circle cx="7" cy="6" r="2.5" stroke="var(--color-brand-glow)" strokeWidth="1.6"/><path d="M1 17c0-3 2.5-5 6-5" stroke="var(--color-brand-glow)" strokeWidth="1.6" strokeLinecap="round"/><circle cx="13" cy="6" r="2.5" stroke="var(--color-brand-glow)" strokeWidth="1.6"/><path d="M13 12c3.5 0 6 2 6 5" stroke="var(--color-brand-glow)" strokeWidth="1.6" strokeLinecap="round"/></svg>,
                  value: trustStats[0]?.value ?? "50+", label: trustStats[0]?.label ?? "Clientes"
                },
                {
                  icon: <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><rect x="2" y="4" width="16" height="13" rx="2" stroke="var(--color-brand-glow)" strokeWidth="1.6"/><path d="M6 2v4M14 2v4M2 9h16" stroke="var(--color-brand-glow)" strokeWidth="1.6" strokeLinecap="round"/></svg>,
                  value: trustStats[1]?.value ?? "7+", label: trustStats[1]?.label ?? "Años"
                },
                {
                  icon: <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M10 2l2 4.9 5.4.8-3.9 3.8.9 5.3L10 14.2l-4.8 2.6.9-5.3L2.2 7.7l5.4-.8L10 2z" stroke="var(--color-brand-glow)" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
                  value: trustStats[2]?.value ?? "4", label: trustStats[2]?.label ?? "Servicios"
                },
                {
                  icon: <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><circle cx="10" cy="10" r="8" stroke="var(--color-brand-glow)" strokeWidth="1.6"/><path d="M7 12.5s1.2 1.5 3 1.5 3-1.5 3-1.5" stroke="var(--color-brand-glow)" strokeWidth="1.6" strokeLinecap="round"/><circle cx="7.5" cy="8.5" r="1" fill="var(--color-brand-glow)"/><circle cx="12.5" cy="8.5" r="1" fill="var(--color-brand-glow)"/></svg>,
                  value: trustStats[3]?.value ?? "100%", label: trustStats[3]?.label ?? "Satisfacción"
                },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 lg:gap-2">
                  <div className="flex-shrink-0">{s.icon}</div>
                  <div>
                    <div className="font-display leading-none" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(0.85rem, 3.8vw, 1.7rem)", color: "var(--color-text)" }}>{s.value}</div>
                    <div className="font-body uppercase tracking-widest mt-0.5" style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--color-dim)", letterSpacing: "0.08em", fontSize: "0.55rem" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: orbital journey ── */}
          <div
            className="flex flex-1 min-h-0 flex-col items-center justify-center lg:justify-start pb-2 lg:pb-0"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(32px)",
              transition: "opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s",
            }}
          >
            {/* The orbit */}
            <div
              className="relative aspect-square"
              style={{ width: "min(90vw, 46svh, 540px)" }}
            >
              <svg viewBox="0 0 320 320" className="w-full h-full -rotate-90">
                <defs>
                  <linearGradient id="orbitGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2A2A2A" />
                    <stop offset="100%" stopColor="#0D0D0D" />
                  </linearGradient>
                </defs>

                {/* Track (dashed until filled by the progress arc) */}
                <circle
                  cx="160" cy="160" r="130"
                  fill="none"
                  stroke="var(--color-border-soft)"
                  strokeWidth="1.5"
                  strokeDasharray="1 9"
                  strokeLinecap="round"
                />
                {/* Progress arc — animated via dashoffset for a smooth fill */}
                <circle
                  cx="160" cy="160" r="130"
                  fill="none"
                  stroke="url(#orbitGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 130}
                  strokeDashoffset={
                    2 * Math.PI * 130 * (1 - active / (steps.length - 1))
                  }
                  style={{
                    transition: "stroke-dashoffset 0.5s cubic-bezier(0.33,1,0.68,1)",
                    filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.25))",
                    willChange: "stroke-dashoffset",
                  }}
                />

                {/* Step nodes around the ring */}
                {steps.map((s, i) => {
                  const ang = (360 / steps.length) * i * (Math.PI / 180);
                  const cx = Number((160 + 130 * Math.cos(ang)).toFixed(3));
                  const cy = Number((160 + 130 * Math.sin(ang)).toFixed(3));
                  const done = i < active;
                  const current = i === active;
                  return (
                    <g
                      key={s.title}
                      className="cursor-pointer"
                      onClick={() => setActive(i)}
                      style={{ transition: "all 0.4s ease" }}
                    >
                      {(current || done) && (
                        <circle
                          cx={cx} cy={cy} r={current ? 14 : 12} fill="none" stroke="#FF5252" strokeWidth="1" opacity="0.35"
                          style={{ animation: "nodeAppear 0.3s ease 0.45s both" }}
                        >
                          {current && (
                            <>
                              <animate attributeName="r" from="14" to="26" dur="1.8s" begin="0.45s" repeatCount="indefinite" />
                              <animate attributeName="opacity" from="0.45" to="0" dur="1.8s" begin="0.45s" repeatCount="indefinite" />
                            </>
                          )}
                        </circle>
                      )}
                      <circle
                        cx={cx} cy={cy}
                        r={current ? 14 : done ? 12 : 4.5}
                        fill={current ? "#FF5252" : done ? "#B71C1C" : "var(--color-surface)"}
                        stroke={current || done ? "transparent" : "var(--color-brand-red-border)"}
                        strokeWidth="1.5"
                        style={{
                          transition: "r 0.3s cubic-bezier(0.34,1.56,0.64,1) 0.45s, fill 0.25s ease 0.45s",
                          filter: current ? "drop-shadow(0 0 9px rgba(255,82,82,0.8))" : "none",
                        }}
                      />
                      {(current || done) && (
                        <text
                          x={cx} y={cy}
                          transform={`rotate(90 ${cx} ${cy})`}
                          textAnchor="middle"
                          dominantBaseline="central"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: current ? "13px" : "11px",
                            fontWeight: 800,
                            fill: "#fff",
                            pointerEvents: "none",
                            animation: "nodeAppear 0.3s ease 0.45s both",
                          }}
                        >
                          {i + 1}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Soft pulsing glow behind the core (never remounts) */}
              <div
                className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
                aria-hidden="true"
                style={{
                  width: "340px",
                  height: "340px",
                  transform: "translate(-50%, -50%)",
                  background: "radial-gradient(circle, rgba(255,82,82,0.20) 0%, rgba(255,82,82,0.10) 35%, transparent 68%)",
                  filter: "blur(34px)",
                  animation: mounted ? "softGlow 5s ease-in-out infinite" : "none",
                }}
              />

              {/* Core — focal point. Crossfades smoothly per step. */}
              <div
                key={active}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-16 pointer-events-none"
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: isFinal ? "78px" : "92px",
                    height: isFinal ? "78px" : "92px",
                    marginBottom: isFinal ? "1rem" : "1.75rem",
                    color: "#fff",
                    background: "linear-gradient(135deg, #FF5252 0%, #B71C1C 50%, #7F0000 100%)",
                    boxShadow: isFinal
                      ? "0 0 44px rgba(255,82,82,0.6)"
                      : "0 18px 38px rgba(127,0,0,0.40)",
                    transition: "all 0.5s ease",
                    animation: "stepIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.02s both",
                  }}
                >
                  <div className={isFinal ? "scale-[1.6]" : "scale-[1.7]"}>{step.icon}</div>
                </div>

                <span
                  className="font-display"
                  style={{ fontFamily: "var(--font-display)", fontSize: isFinal ? "0.66rem" : "0.74rem", fontWeight: 800, color: "var(--color-dim)", letterSpacing: "0.3em", animation: "stepIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.09s both" }}
                >
                  {isFinal ? "META ALCANZADA" : `PASO ${String(active + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`}
                </span>

                <h3
                  className="font-display"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: isFinal ? "1.55rem" : "1.85rem",
                    fontWeight: 800,
                    color: isFinal ? "var(--color-brand-glow)" : "var(--color-text)",
                    lineHeight: 1.12,
                    letterSpacing: "-0.025em",
                    marginTop: isFinal ? "0.65rem" : "1rem",
                    transition: "font-size 0.4s ease",
                    animation: "stepIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.16s both",
                  }}
                >
                  {step.title}
                </h3>

                <p
                  className="font-body"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: isFinal ? "0.85rem" : "0.98rem",
                    fontWeight: 400,
                    color: "var(--color-muted)",
                    lineHeight: 1.55,
                    marginTop: isFinal ? "0.5rem" : "1rem",
                    maxWidth: isFinal ? "min(15rem, 100%)" : "min(17rem, 100%)",
                    animation: "stepIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.23s both",
                  }}
                >
                  {step.desc}
                </p>

                {/* CTA appears in the center once the journey is complete */}
                {isFinal && (
                  <button
                    onClick={() => handleScrollTo("contact")}
                    className="group pointer-events-auto inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-full transition-[filter] duration-200 hover:brightness-110 active:brightness-90"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#fff",
                      background: "linear-gradient(135deg, #B71C1C 0%, #7F0000 100%)",
                      boxShadow: "0 10px 28px rgba(183,28,28,0.5)",
                      animation:
                        "stepIn 0.55s cubic-bezier(0.22,1,0.36,1) 0.3s both, ctaPulse 1.7s ease-in-out 1s infinite",
                    }}
                  >
                    Empezar mi proyecto
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
