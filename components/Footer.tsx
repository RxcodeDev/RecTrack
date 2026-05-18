'use client';

import Image from "next/image";
import Link from "next/link";
import type { FooterContent } from "@/lib/content";

const navLinks = [
  { label: "Servicios",      href: "#services" },
  { label: "Trabajos",       href: "#portfolio" },
  { label: "Nosotros",       href: "#stats" },
  { label: "Testimonios",   href: "#testimonials" },
  { label: "Contacto",       href: "#contact" },
];

const serviceLinks = [
  { label: "Desarrollo Web",       href: "#services" },
  { label: "Contenido Audiovisual", href: "#services" },
  { label: "Fotografía",           href: "#services" },
  { label: "Campañas de Marketing", href: "#services" },
];

const legalLinks = [
  { label: "Política de Privacidad", href: "#" },
  { label: "Términos de Servicio",   href: "#" },
  { label: "Política de Cookies",    href: "#" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/rectrackmarketingdigital",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path d="M14 8.5h2.5V5.5H14c-2.21 0-4 1.79-4 4V11H8v3h2v7h3v-7h2.5l.5-3H13V9.5c0-.55.45-1 1-1z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@rectrackmarketingdigital",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path d="M16.5 2.5c.3 2 1.6 3.6 3.5 3.9v3c-1.4.1-2.7-.3-3.9-1V15a6 6 0 11-6-6c.3 0 .6 0 .9.1v3.1a3 3 0 102.1 2.8V2.5h3.4z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/rectrackmarketingdigital",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

function handleScrollTo(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Footer({ data }: { data?: FooterContent }) {
  const year = new Date().getFullYear();
  const tagline = data?.tagline ?? "Impulsando marcas que generan cambios.";
  const footerEmail = data?.email ?? "contacto@rectrackmarketingdigital.com";
  const footerPhone = data?.phone ?? "+52 (33) 3615-4478";
  const footerWhatsapp = data?.whatsappNumber ?? "523336154478";
  const footerLocation = data?.location ?? "Guadalajara, Jalisco, México";
  const liveSocialLinks = socialLinks.map((s) => ({
    ...s,
    href: data?.social ? (s.label === "Facebook" ? data.social.facebook : s.label === "TikTok" ? data.social.tiktok : data.social.instagram) : s.href,
  }));
  const liveLegalLinks = data?.legalLinks ?? legalLinks;

  return (
    <footer className="" role="contentinfo" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Top border in brand-subtle */}
      <div className="h-px w-full" style={{ backgroundColor: "var(--color-brand-red-bg)" }} />

      {/* ── Upper footer ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1 — Brand + tagline */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center mb-5 group"
              aria-label="Volver al inicio"
            >
              <Image
                src="/logos/transparente.png"
                alt="ReckTrack Marketing Digital"
                width={160}
                height={48}
                className="h-10 w-auto object-contain"
              />
            </button>

            {/* Tagline */}
            <p
              className="mb-6 leading-relaxed"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                fontWeight: 400,
                color: "var(--color-muted)",
                lineHeight: 1.7,
                fontStyle: "italic",
              }}
            >
              {tagline}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3" role="list" aria-label="Social media links">
              {liveSocialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  role="listitem"
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  style={{
                    backgroundColor: "var(--color-raised)",
                    color: "var(--color-muted)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--color-brand-primary)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-text)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--color-raised)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-muted)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <h3
              className="mb-5 uppercase tracking-widest text-xs"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--color-text)",
                letterSpacing: "0.14em",
                fontSize: "0.7rem",
              }}
            >
              Navegar
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleScrollTo(link.href)}
                    className="nav-link text-sm transition-colors duration-300 hover:text-brand-primary"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 400,
                      color: "var(--color-muted)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Services */}
          <div>
            <h3
              className="mb-5 uppercase tracking-widest text-xs"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--color-text)",
                letterSpacing: "0.14em",
                fontSize: "0.7rem",
              }}
            >
              Servicios
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleScrollTo(link.href)}
                    className="nav-link text-sm transition-colors duration-300 hover:text-brand-primary"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 400,
                      color: "var(--color-muted)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact info */}
          <div>
            <h3
              className="mb-5 uppercase tracking-widest text-xs"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--color-text)",
                letterSpacing: "0.14em",
                fontSize: "0.7rem",
              }}
            >
              Contacto
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              <li>
                <a
                  href={`mailto:${footerEmail}`}
                  className="text-sm transition-colors duration-300 hover:text-brand-primary"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 400,
                    color: "var(--color-muted)",
                    fontSize: "0.9rem",
                  }}
                >
                  {footerEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:+${footerPhone.replace(/\D/g, "")}`}
                  className="text-sm transition-colors duration-300 hover:text-brand-primary"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 400,
                    color: "var(--color-muted)",
                    fontSize: "0.9rem",
                  }}
                >
                  {footerPhone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${footerWhatsapp}?text=Hola%2C%20me%20interesa%20cotizar%20un%20proyecto%20con%20ReckTrack%20Marketing%20Digital.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors duration-300 hover:text-brand-primary"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 400,
                    color: "var(--color-muted)",
                    fontSize: "0.9rem",
                  }}
                >
                  WhatsApp directo
                </a>
              </li>
              <li
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 400,
                  color: "var(--color-muted)",
                  fontSize: "0.9rem",
                }}
              >
                {footerLocation}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-px w-full" style={{ backgroundColor: "var(--color-border)" }} />
      </div>

      {/* ── Lower footer ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              fontWeight: 400,
              color: "var(--color-dim)",
            }}
          >
            &copy; {year} ReckTrack Marketing Digital. Todos los derechos reservados.
          </p>

          {/* Legal links */}
          <div className="flex items-center gap-1" role="list" aria-label="Legal links">
            {liveLegalLinks.map((link, i) => (
              <span key={link.label} className="flex items-center" role="listitem">
                {i > 0 && (
                  <span
                    className="mx-2"
                    style={{ color: "var(--color-border)" }}
                    aria-hidden="true"
                  >
                    ·
                  </span>
                )}
                <Link
                  href={link.href}
                  className="transition-colors duration-300 hover:text-brand-primary"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8rem",
                    fontWeight: 400,
                    color: "var(--color-dim)",
                  }}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>

          {/* Crafted with badge */}
          <div className="flex items-center gap-1.5">
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 400,
                color: "var(--color-dim)",
              }}
            >
              Hecho por
            </span>
            {/* Logo de la consultoría — reemplaza el src por tu imagen en /public/logos/ */}
            <img
              src="/logos/rxcode.png"
              alt="Rxcode"
              style={{ height: "18px", width: "auto", objectFit: "contain" }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 400,
                color: "var(--color-dim)",
              }}
            >
              Rxcode
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
