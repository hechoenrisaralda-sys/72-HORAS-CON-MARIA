"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Countdown from "@/components/Countdown";
import { Radio, Info, MapPin } from "lucide-react";

export default function TransmisionPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center bg-navy px-5 py-16 text-cream md:px-6">
        <div className="mx-auto w-full max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-sm font-semibold text-gold">
            <Radio className="h-4 w-4" /> Transmisión oficial
          </div>

          <Countdown />

          <div className="mt-10 rounded-2xl border border-gold/30 bg-white/5 p-6 text-cream md:mt-12 md:p-10">
            <Radio className="mx-auto mb-4 h-10 w-10 text-gold" />
            <h2 className="font-serif text-2xl font-bold md:text-3xl">
              La transmisión se habilitará próximamente
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-cream/70 md:text-base">
              Estamos preparando la señal en vivo para las 72 Horas con María.
              Cuando esté lista, el reproductor aparecerá en esta misma página.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-gold/20 bg-white/5 p-6 md:flex-row md:justify-between">
            <div className="flex items-start gap-3 text-left">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="font-semibold">Información del evento</p>
                <p className="text-sm text-cream/70">
                  5, 6 y 7 de septiembre de 2026 · 72 horas continuas · Hora de
                  Bogotá (GMT-5)
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-gold">
                  <MapPin className="h-4 w-4" />
                  Salón Santuario, ExpoFuturo Pereira, Risaralda
                </p>
              </div>
            </div>
            <a
              href="/programacion"
              className="rounded-xl bg-gold px-6 py-3 font-semibold text-navy transition hover:bg-[#b8983e]"
            >
              Ver custodio de la hora
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
