'use client';

import type { NavbarContent, ContactContent } from "@/lib/content";

export default function FloatingButtons({
  navbar,
  contact,
}: {
  navbar?: NavbarContent;
  contact?: ContactContent;
}) {
  const whatsappNumber = navbar?.whatsappNumber ?? "523336154478";
  const whatsappMessage = navbar?.whatsappMessage ?? "Hola%2C%20me%20interesa%20cotizar%20un%20proyecto%20con%20ReckTrack%20Marketing%20Digital.";
  const phone = contact?.phone ?? "";

  // Strips formatting to get a raw tel: href
  const telHref = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : "#contact";

  return (
    <div
      className="fixed bottom-6 right-5 z-50 flex flex-col items-center gap-3"
      aria-label="Contacto rápido"
    >
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="flex items-center justify-center w-13 h-13 rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          backgroundColor: "#15a148",
          boxShadow: "0 4px 18px rgba(37,211,102,0.45)",
          width: 52,
          height: 52,
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.057 23.5a.5.5 0 00.609.61l5.76-1.51A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.854 9.854 0 01-5.031-1.378l-.36-.214-3.733.979.997-3.645-.235-.374A9.86 9.86 0 012.1 12C2.1 6.532 6.532 2.1 12 2.1S21.9 6.532 21.9 12 17.468 21.9 12 21.9z"/>
        </svg>
      </a>

      {/* Teléfono */}
      <a
        href={telHref}
        aria-label="Llámanos por teléfono"
        className="flex items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          backgroundColor: "var(--color-brand-primary, #e63946)",
          boxShadow: "0 4px 18px rgba(230,57,70,0.40)",
          width: 52,
          height: 52,
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.21 2.2z"/>
        </svg>
      </a>
    </div>
  );
}
