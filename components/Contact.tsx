'use client';

import { useEffect, useRef, useState, FormEvent } from "react";
import type { ContactContent } from "@/lib/content";

type FormStatus = "idle" | "sending" | "success" | "error";

interface FormFields {
  name: string;
  email: string;
  lada: string;
  phone: string;
  state: string;
  budget: string;
  budgetOther: string;
}

const mexicanStates = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
];

// Cada rango de presupuesto define los servicios incluidos.
const budgetTiers: { value: string; label: string; services: string[] }[] = [
  {
    value: "starter",
    label: "$5,000 – $15,000 MXN / mes",
    services: [
      "Gestión de redes sociales",
      "Diseño de contenido básico",
      "Reporte mensual de métricas",
    ],
  },
  {
    value: "growth",
    label: "$15,000 – $30,000 MXN / mes",
    services: [
      "Gestión de redes sociales",
      "Campaña de publicidad pagada",
      "Fotografía de producto",
      "Reporte quincenal de métricas",
    ],
  },
  {
    value: "pro",
    label: "$30,000 – $60,000 MXN / mes",
    services: [
      "Estrategia de marketing integral",
      "Producción audiovisual",
      "Campañas de publicidad multicanal",
      "Desarrollo web",
      "Reporte semanal de métricas",
    ],
  },
  {
    value: "enterprise",
    label: "$60,000+ MXN / mes",
    services: [
      "Servicio integral 360°",
      "Producción audiovisual premium",
      "Branding completo",
      "Desarrollo web a medida",
      "Campañas multicanal",
      "Ejecutivo de cuenta dedicado",
    ],
  },
  {
    value: "otro",
    label: "Otro / Aún no lo sé",
    services: [],
  },
];

const ladaOptions = [
  { code: "+52", label: "🇲🇽 +52 México" },
  { code: "+1", label: "🇺🇸 +1 EE. UU. / Canadá" },
  { code: "+34", label: "🇪🇸 +34 España" },
  { code: "+54", label: "🇦🇷 +54 Argentina" },
  { code: "+57", label: "🇨🇴 +57 Colombia" },
  { code: "+56", label: "🇨🇱 +56 Chile" },
  { code: "+51", label: "🇵🇪 +51 Perú" },
  { code: "+58", label: "🇻🇪 +58 Venezuela" },
  { code: "+593", label: "🇪🇨 +593 Ecuador" },
  { code: "+502", label: "🇬🇹 +502 Guatemala" },
];

const contactDetails = [
  {
    label: "Correo",
    value: "contacto@rectrackmarketingdigital.com",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" aria-hidden="true">
        <rect x="2" y="5" width="16" height="11" rx="2" stroke="var(--color-brand-primary)" strokeWidth="1.6" />
        <path d="M2 7l8 5 8-5" stroke="var(--color-brand-primary)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Teléfono",
    value: "+52 (33) 3615-4478",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" aria-hidden="true">
        <path
          d="M4 3h3.5l1.5 4-2 1.5a10 10 0 004.5 4.5L13 11l4 1.5V16a1 1 0 01-1 1C6.5 17 3 10.5 3 4a1 1 0 011-1z"
          stroke="var(--color-brand-primary)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Ubicación",
    value: "Guadalajara, Jalisco, México",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" aria-hidden="true">
        <path
          d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z"
          stroke="var(--color-brand-primary)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="8" r="2" stroke="var(--color-brand-primary)" strokeWidth="1.6" />
      </svg>
    ),
  },
];

function useScrollReveal(threshold = 0.12) {
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

const inputBase: React.CSSProperties = {
  width: "100%",
  borderRadius: 10,
  padding: "11px 14px",
  fontFamily: "var(--font-body)",
  fontSize: "0.9rem",
  color: "var(--color-text)",
  backgroundColor: "var(--color-surface)",
  borderWidth: "1.5px",
  borderStyle: "solid",
  borderColor: "rgba(0,0,0,0.16)",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};
const inputFocusStyle: React.CSSProperties = {
  borderColor: "var(--color-brand-primary)",
  boxShadow: "0 0 0 3px color-mix(in srgb, var(--color-brand-primary) 12%, transparent)",
};
const inputErrorStyle: React.CSSProperties = {
  borderColor: "var(--color-brand-primary)",
};

export default function Contact({ data }: { data?: ContactContent }) {
  const sectionLabel = data?.sectionLabel ?? "Contáctanos";
  const heading = data?.heading ?? "¿Listo para crecer?";
  const subtext = data?.subtext ?? "Cuéntanos sobre tu proyecto y te responderemos en un día hábil.";
  const contactEmail = data?.email ?? "contacto@rectrackmarketingdigital.com";
  const contactPhone = data?.phone ?? "+52 (33) 3615-4478";
  const contactLocation = data?.location ?? "Guadalajara, Jalisco, México";
  const liveContactDetails = [
    { ...contactDetails[0], value: contactEmail },
    { ...contactDetails[1], value: contactPhone },
    { ...contactDetails[2], value: contactLocation },
  ];
  const { ref, visible } = useScrollReveal();
  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    lada: "+52",
    phone: "",
    state: "",
    budget: "",
    budgetOther: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [focused, setFocused] = useState<string | null>(null);

  // Servicios incluidos derivados del presupuesto seleccionado.
  const includedServices =
    budgetTiers.find((t) => t.value === fields.budget)?.services ?? [];

  const validate = (): boolean => {
    const newErrors: Partial<FormFields> = {};
    if (!fields.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!fields.email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      newErrors.email = "Por favor, ingresa un email válido.";
    }
    const phoneDigits = fields.phone.replace(/\D/g, "");
    if (!fields.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio.";
    } else if (phoneDigits.length !== 10) {
      newErrors.phone = "El teléfono debe tener exactamente 10 dígitos.";
    }
    if (!fields.state) newErrors.state = "Selecciona tu entidad.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormFields]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, services: includedServices }),
      });
      if (!res.ok) throw new Error("server_error");
      setStatus("success");
      setFields({ name: "", email: "", lada: "+52", phone: "", state: "", budget: "", budgetOther: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24" style={{ backgroundColor: "var(--color-bg)" }}>
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
            className="font-display mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              color: "var(--color-text)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            {heading.split('crecer').length > 1 ? <>{heading.split('crecer')[0]}<span style={{ color: "var(--color-brand-primary)" }}>crecer?</span></> : heading}
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
            {subtext}
          </p>
        </div>

        {/* Two-column layout: form left, info right */}
        <div
          className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
        >
          {/* ── Form (3/5 width on lg) ────────────────────────────── */}
          <div className="lg:col-span-3">
            {status === "success" ? (
              <div
                className="flex flex-col items-center justify-center text-center py-20 px-8 rounded-2xl"
                style={{ backgroundColor: "var(--color-brand-red-bg)" }}
              >
                {/* Check mark */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: "var(--color-brand-primary)" }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12l5 5L19 7"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  className="font-display mb-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "var(--color-text)",
                  }}
                >
                  ¡Mensaje recibido!
                </h3>
                <p
                  className="font-body"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.95rem",
                    color: "var(--color-muted)",
                    lineHeight: 1.7,
                    maxWidth: "28rem",
                  }}
                >
                  Gracias por contactarnos. Un miembro de nuestro equipo se
                  comunicará contigo en un día hábil.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-8 btn-ghost"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <>
              {status === "error" && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm"
                  style={{ backgroundColor: "color-mix(in srgb, var(--color-brand-primary) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--color-brand-primary) 25%, transparent)", color: "var(--color-brand-primary)", fontFamily: "var(--font-body)" }}>
                  Ocurrió un error al enviar. Inténtalo de nuevo o escríbenos a{" "}
                  <a href="mailto:contacto@rectrackmarketingdigital.com" style={{ fontWeight: 600, textDecoration: "underline" }}>contacto@rectrackmarketingdigital.com</a>.
                </div>
              )}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block font-body text-xs font-600 mb-1.5 uppercase tracking-wider"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        color: "var(--color-text)",
                        letterSpacing: "0.08em",
                        fontSize: "0.7rem",
                      }}
                    >
                      Nombre<span style={{ color: "var(--color-brand-primary)" }}>*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={fields.name}
                      onChange={handleChange}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      placeholder="Carolina Ferreira"
                      autoComplete="name"
                      style={{ ...inputBase, ...(focused === "name" ? inputFocusStyle : {}), ...(errors.name ? inputErrorStyle : {}) }}
                      aria-describedby={errors.name ? "error-name" : undefined}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p
                        id="error-name"
                        className="mt-1.5 text-xs font-body"
                        style={{ color: "var(--color-brand-primary)", fontFamily: "var(--font-body)" }}
                        role="alert"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block font-body text-xs font-600 mb-1.5 uppercase tracking-wider"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        color: "var(--color-text)",
                        letterSpacing: "0.08em",
                        fontSize: "0.7rem",
                      }}
                    >
                      Correo Electrónico <span style={{ color: "var(--color-brand-primary)" }}>*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={fields.email}
                      onChange={handleChange}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      placeholder="tu@empresa.com"
                      autoComplete="email"
                      style={{ ...inputBase, ...(focused === "email" ? inputFocusStyle : {}), ...(errors.email ? inputErrorStyle : {}) }}
                      aria-describedby={errors.email ? "error-email" : undefined}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p
                        id="error-email"
                        className="mt-1.5 text-xs font-body"
                        style={{ color: "var(--color-brand-primary)", fontFamily: "var(--font-body)" }}
                        role="alert"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block font-body text-xs font-600 mb-1.5 uppercase tracking-wider"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      color: "var(--color-text)",
                      letterSpacing: "0.08em",
                      fontSize: "0.7rem",
                    }}
                  >
                    Teléfono <span style={{ color: "var(--color-brand-primary)" }}>*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="contact-lada"
                      name="lada"
                      aria-label="Lada / código de país"
                      value={fields.lada}
                      onChange={handleChange}
                      onFocus={() => setFocused("lada")}
                      onBlur={() => setFocused(null)}
                      style={{
                        ...inputBase,
                        width: "auto",
                        flexShrink: 0,
                        cursor: "pointer",
                        ...(focused === "lada" ? inputFocusStyle : {}),
                      }}
                    >
                      {ladaOptions.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={fields.phone}
                      onChange={handleChange}
                      onFocus={() => setFocused("phone")}
                      onBlur={() => setFocused(null)}
                      placeholder="33 1234 5678"
                      autoComplete="tel-national"
                      inputMode="numeric"
                      style={{ ...inputBase, ...(focused === "phone" ? inputFocusStyle : {}), ...(errors.phone ? inputErrorStyle : {}) }}
                      aria-describedby={errors.phone ? "error-phone" : undefined}
                      aria-invalid={!!errors.phone}
                    />
                  </div>
                  {errors.phone && (
                    <p
                      id="error-phone"
                      className="mt-1.5 text-xs font-body"
                      style={{ color: "var(--color-brand-primary)", fontFamily: "var(--font-body)" }}
                      role="alert"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* State + Budget row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* State */}
                  <div>
                    <label
                      htmlFor="contact-state"
                      className="block font-body text-xs font-600 mb-1.5 uppercase tracking-wider"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        color: "var(--color-text)",
                        letterSpacing: "0.08em",
                        fontSize: "0.7rem",
                      }}
                    >
                      Entidad <span style={{ color: "var(--color-brand-primary)" }}>*</span>
                    </label>
                    <select
                      id="contact-state"
                      name="state"
                      value={fields.state}
                      onChange={handleChange}
                      onFocus={() => setFocused("state")}
                      onBlur={() => setFocused(null)}
                      style={{ ...inputBase, cursor: "pointer", ...(focused === "state" ? inputFocusStyle : {}), ...(errors.state ? inputErrorStyle : {}) }}
                      aria-describedby={errors.state ? "error-state" : undefined}
                      aria-invalid={!!errors.state}
                    >
                      <option value="">Selecciona tu entidad…</option>
                      {mexicanStates.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p
                        id="error-state"
                        className="mt-1.5 text-xs font-body"
                        style={{ color: "var(--color-brand-primary)", fontFamily: "var(--font-body)" }}
                        role="alert"
                      >
                        {errors.state}
                      </p>
                    )}
                  </div>

                  {/* Budget */}
                  <div>
                    <label
                      htmlFor="contact-budget"
                      className="block font-body text-xs font-600 mb-1.5 uppercase tracking-wider"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        color: "var(--color-text)",
                        letterSpacing: "0.08em",
                        fontSize: "0.7rem",
                      }}
                    >
                      Presupuesto{" "}
                      <span
                        style={{
                          color: "var(--color-dim)",
                          fontWeight: 500,
                          textTransform: "none",
                          letterSpacing: 0,
                        }}
                      >
                        (opcional)
                      </span>
                    </label>
                    <select
                      id="contact-budget"
                      name="budget"
                      value={fields.budget}
                      onChange={handleChange}
                      onFocus={() => setFocused("budget")}
                      onBlur={() => setFocused(null)}
                      style={{ ...inputBase, cursor: "pointer", ...(focused === "budget" ? inputFocusStyle : {}) }}
                    >
                      <option value="">Selecciona un rango…</option>
                      {budgetTiers.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Monto personalizado cuando elige "Otro" */}
                {fields.budget === "otro" && (
                  <div>
                    <label
                      htmlFor="contact-budget-other"
                      className="block font-body text-xs font-600 mb-1.5 uppercase tracking-wider"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        color: "var(--color-text)",
                        letterSpacing: "0.08em",
                        fontSize: "0.7rem",
                      }}
                    >
                      ¿Cuánto tienes en mente?
                    </label>
                    <input
                      id="contact-budget-other"
                      type="text"
                      name="budgetOther"
                      value={fields.budgetOther}
                      onChange={handleChange}
                      onFocus={() => setFocused("budgetOther")}
                      onBlur={() => setFocused(null)}
                      placeholder="Ej. $8,000 MXN / mes o un rango aproximado"
                      style={{ ...inputBase, ...(focused === "budgetOther" ? inputFocusStyle : {}) }}
                    />
                  </div>
                )}

                {/* Servicios incluidos — auto según presupuesto */}
                {includedServices.length > 0 && (
                  <div
                    className="rounded-xl p-5"
                    style={{ backgroundColor: "var(--color-brand-red-bg)" }}
                  >
                    <p
                      className="font-body text-xs uppercase tracking-wider mb-3"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        color: "var(--color-brand-primary)",
                        letterSpacing: "0.08em",
                        fontSize: "0.7rem",
                      }}
                    >
                      Servicios incluidos en este plan
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {includedServices.map((srv) => (
                        <span
                          key={srv}
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
                          style={{
                            backgroundColor: "var(--color-surface)",
                            fontFamily: "var(--font-body)",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            color: "var(--color-text)",
                          }}
                        >
                          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
                            <path d="M3 8.5l3 3 7-7" stroke="var(--color-brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full sm:w-auto btn-primary disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  {status === "sending" ? (
                    <span className="flex items-center gap-2">
                      {/* Spinner */}
                      <svg
                        className="animate-spin w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeOpacity="0.25"
                        />
                        <path
                          d="M22 12a10 10 0 00-10-10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Enviando…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Enviar Mensaje
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </button>

                <p
                  className="font-body text-xs"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--color-dim)",
                    lineHeight: 1.6,
                  }}
                >
                  Respetamos tu privacidad. Tu información nunca es compartida
                  ni vendida.
                </p>
              </form>
              </>
            )}
          </div>

          {/* ── Contact info (2/5 width on lg) ───────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Contact details */}
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              <h3
                className="font-display mb-6"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--color-text)",
                }}
              >
                Detalles de Contacto
              </h3>
              <div className="flex flex-col gap-5">
                {liveContactDetails.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: "var(--color-brand-red-bg)" }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p
                        className="font-body text-xs uppercase tracking-wider mb-0.5"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 600,
                          color: "var(--color-dim)",
                          letterSpacing: "0.1em",
                          fontSize: "0.65rem",
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="font-body text-sm"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 500,
                          color: "var(--color-text)",
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
}
