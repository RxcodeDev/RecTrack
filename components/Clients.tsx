'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ClientsContent } from "@/lib/content";

const defaultClients = [
  { name: "Alui Holística",        src: "/clientes/ALUI-HOLISTICA.png" },
  { name: "Bolis Purileo",         src: "/clientes/Bolis_Purileo.png" },
  { name: "Dental White",          src: "/clientes/dentalwhite.png" },
  { name: "Dr. René Dentista",     src: "/clientes/Dr Rene Dentista.png" },
  { name: "IDAM Arte",             src: "/clientes/IDAM arte.png" },
  { name: "Glory Gtz Makeup",      src: "/clientes/makeup_artist_glory.png" },
  { name: "SH Curly Store",        src: "/clientes/SH curly store.png" },
  { name: "TeraFitness",           src: "/clientes/TeraFitness_fisoteraipai.png" },
];
const defaultLabel = "Empresas que confían en nosotros";

export default function Clients({ data }: { data?: ClientsContent }) {
  const clients = data?.items ?? defaultClients;
  const sectionLabel = data?.label ?? defaultLabel;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 border-t border-b" style={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Label */}
        <div
          ref={ref}
          className="flex items-center justify-center gap-3 mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          <div className="h-px flex-1 max-w-24" style={{ backgroundColor: "var(--color-border)" }} />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "0.7rem",
              color: "var(--color-dim)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {sectionLabel}
          </span>
          <div className="h-px flex-1 max-w-24" style={{ backgroundColor: "var(--color-border)" }} />
        </div>

        {/* Logo grid — desktop/tablet */}
        <div className="hidden sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center justify-items-center">
          {clients.map((client, i) => (
            <div
              key={client.name}
              className="w-full flex items-center justify-center px-3 py-2 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              style={{
                opacity: visible ? undefined : 0,
                animation: visible ? `fadeUp 0.5s ease forwards ${i * 0.07}s` : "none",
              }}
              title={client.name}
            >
              <Image
                src={client.src}
                alt={client.name}
                width={120}
                height={60}
                className="object-contain max-h-14 w-auto"
              />
            </div>
          ))}
        </div>

        {/* Logo marquee — mobile only */}
        <div
          className="sm:hidden overflow-hidden"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease",
            maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <div
            className="flex items-center"
            style={{
              animation: "marquee 18s linear infinite",
              width: "max-content",
            }}
          >
            {[...clients, ...clients].map((client, i) => (
              <div
                key={`${client.name}-${i}`}
                className="flex items-center justify-center px-6 grayscale-0 opacity-100 sm:grayscale sm:opacity-60 sm:hover:grayscale-0 sm:hover:opacity-100 transition-all duration-300"
                style={{ minWidth: "110px" }}
                title={client.name}
              >
                <Image
                  src={client.src}
                  alt={client.name}
                  width={100}
                  height={50}
                  className="object-contain max-h-12 w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
