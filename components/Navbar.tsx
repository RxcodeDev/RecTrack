'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import type { NavbarContent } from "@/lib/content";

function ReckTrackLogo({ className = "" }: { className?: string }) {
  return (
    // Logo del nav. Reemplaza el src por tu imagen en /public/logos/.
    <img
      src="/logos/transparente.png"
      alt="ReckTrack Marketing Digital"
      className={className}
      style={{ height: 44, width: "auto", objectFit: "contain", userSelect: "none" }}
    />
  );
}

const navLinks = [
  { label: "Servicios", href: "#services" },
  { label: "Trabajos", href: "#portfolio" },
  { label: "Nosotros", href: "#stats" },
  { label: "Contacto", href: "#contact" },
];

export default function Navbar({ data }: { data?: NavbarContent }) {
  const whatsappNumber = data?.whatsappNumber ?? "523336154478";
  const whatsappMessage = data?.whatsappMessage ?? "Hola%2C%20me%20interesa%20cotizar%20un%20proyecto%20con%20ReckTrack%20Marketing%20Digital.";
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [activeLink,   setActiveLink]   = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNavClick = (href: string) => {
    setActiveLink(href);
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl border-b"
          : "bg-transparent"
      }`}
      style={scrolled ? { backgroundColor: "var(--color-bg-overlay)", borderColor: "var(--color-border)" } : {}}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">

          {/* ── Logo ──────────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="ReckTrack MD — Inicio"
          >
            <ReckTrackLogo />
          </Link>

          {/* ── Desktop nav links ──────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`nav-link text-sm font-body font-500 tracking-wide transition-colors duration-300 ${
                  activeLink === link.href ? "text-brand-primary" : ""
                }`}
                style={activeLink === link.href
                  ? { fontFamily: "var(--font-body)", fontWeight: 500 }
                  : { fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--color-muted)" }}
              >
                {link.label}
              </button>
            ))}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-display font-600 tracking-wide transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "var(--color-on-brand)", backgroundColor: "var(--color-whatsapp)", boxShadow: "0 2px 12px color-mix(in srgb, var(--color-whatsapp-bright) 35%, transparent)" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.057 23.5a.5.5 0 00.609.61l5.76-1.51A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.854 9.854 0 01-5.031-1.378l-.36-.214-3.733.979.997-3.645-.235-.374A9.86 9.86 0 012.1 12C2.1 6.532 6.532 2.1 12 2.1S21.9 6.532 21.9 12 17.468 21.9 12 21.9z"/>
              </svg>
              Cotizar Proyecto
            </a>
          </nav>

          {/* ── Mobile hamburger ──────────────────────────────────── */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg transition-colors duration-300"
            style={{ backgroundColor: "var(--color-border)" }}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block w-5 h-0.5 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              style={{ backgroundColor: "var(--color-text)" }}
            />
            <span
              className={`block w-5 h-0.5 transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
              style={{ backgroundColor: "var(--color-text)" }}
            />
            <span
              className={`block w-5 h-0.5 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              style={{ backgroundColor: "var(--color-text)" }}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ─────────────────────────────────────────── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } backdrop-blur-xl border-b`}
        style={{ backgroundColor: "var(--color-bg-overlay)", borderColor: "var(--color-border)" }}
      >
        <nav
          className="flex flex-col gap-1 px-6 py-4"
          aria-label="Navegación móvil"
        >
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`text-left px-4 py-3 rounded-lg text-base font-body font-500 transition-all duration-300 ${
                activeLink === link.href ? "text-brand-primary" : ""
              }`}
              style={activeLink === link.href ? { backgroundColor: "var(--color-brand-red-bg)", fontFamily: "var(--font-body)", fontWeight: 500 } : { fontFamily: "var(--font-body)", fontWeight: 500 }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("#contact")}
            className="mt-2 px-4 py-3 rounded-lg bg-brand-primary text-white text-base font-display font-600 text-left hover:bg-brand-deep transition-all duration-300"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Cotizar →
          </button>
        </nav>
      </div>
    </header>
  );
}
