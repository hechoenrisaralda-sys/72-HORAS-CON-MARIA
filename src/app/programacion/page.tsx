"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Clock, ChevronDown, ChevronUp, User, Users, MapPin } from "lucide-react";

type Slot = {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: "disponible" | "ocupado";
  nombreDisplay?: string | null;
  custodio?: {
    tipo?: string;
    tipoGrupo?: string | null;
    nombreGrupo?: string | null;
    ciudad?: string | null;
    nombreResponsable?: string;
  } | null;
};

const FECHAS = ["2026-09-05", "2026-09-06", "2026-09-07"];

function formatFecha(fecha: string) {
  const d = new Date(fecha + "T00:00:00-05:00");
  return d.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Bogota",
  });
}

export default function ProgramacionPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [openDay, setOpenDay] = useState<string | null>("2026-09-05");

  useEffect(() => {
    fetch("/api/programacion")
      .then((r) => r.json())
      .then((data) => {
        setSlots(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Slot[]> = {};
    for (const fecha of FECHAS) {
      map[fecha] = slots
        .filter((s) => s.fecha === fecha)
        .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    }
    return map;
  }, [slots]);

  const filtered = useMemo(() => {
    if (!query.trim()) return slots;
    const q = query.toLowerCase();
    return slots.filter(
      (s) =>
        s.nombreDisplay?.toLowerCase().includes(q) ||
        s.custodio?.ciudad?.toLowerCase().includes(q) ||
        s.horaInicio.includes(q)
    );
  }, [slots, query]);

  const SlotRow = ({ slot }: { slot: Slot }) => {
    const isQuarter = ["06:00", "12:00", "18:00", "00:00"].includes(slot.horaInicio);
    return (
      <div
        className={`flex items-start gap-3 border-b border-gray/10 px-3 py-2.5 transition hover:bg-white/60 md:items-center md:gap-4 md:px-4 md:py-3 ${
          isQuarter ? "border-t-2 border-t-gold/30" : ""
        }`}
      >
        <div className="w-16 shrink-0 font-serif text-xl font-bold text-navy md:w-20 md:text-2xl">
          {slot.horaInicio}
        </div>
        <div className="flex-1 min-w-0">
          {slot.estado === "ocupado" && slot.custodio ? (
            <div className="flex items-start gap-2 md:items-center">
              {slot.custodio.tipo === "grupo" ? (
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-gold md:mt-0" />
              ) : (
                <User className="mt-0.5 h-4 w-4 shrink-0 text-gold md:mt-0" />
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-sm text-navy md:text-base">
                  {slot.custodio.tipo === "grupo" && slot.custodio.nombreGrupo
                    ? slot.custodio.nombreGrupo
                    : slot.custodio.nombreResponsable}
                </p>
                {slot.custodio.tipo === "grupo" && (
                  <p className="text-xs text-gray">
                    Responsable: {slot.custodio.nombreResponsable}
                    {slot.custodio.ciudad ? ` · ${slot.custodio.ciudad}` : ""}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-gray">Disponible</span>
              <Link
                href={`/inscripcion?slot=${slot.id}`}
                className="self-start rounded-lg bg-gold px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-[#b8983e]"
              >
                Ser guía
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <header className="bg-navy px-4 py-10 text-center text-cream md:px-6 md:py-14">
        <h1 className="font-serif text-2xl font-bold md:text-5xl">
          Programación 72 Horas con{" "}
          <span className="font-script text-gold">María</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-cream/70 md:mt-4 md:text-base">
          72 horas continuas de rezo del Rosario · 5, 6 y 7 de septiembre de 2026
        </p>
        <p className="mx-auto mt-2 inline-flex items-center gap-2 text-sm text-gold md:text-base">
          <MapPin className="h-4 w-4" />
          Salón Santuario, ExpoFuturo Pereira, Risaralda
        </p>
      </header>

      <main className="flex-1 bg-cream px-4 py-6 md:px-6 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col items-start justify-between gap-3 md:mb-8 md:flex-row md:items-center">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gold md:top-3" />
              <input
                type="text"
                placeholder="Buscar por nombre o ciudad"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-gold/30 bg-white py-2 pl-10 pr-4 text-sm text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold md:py-2.5 md:text-base"
              />
            </div>
            <span className="flex items-center gap-2 rounded-full border border-gold/40 bg-white px-3 py-1.5 text-xs font-semibold text-gold md:px-4 md:py-2 md:text-sm">
              <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" /> Hora de Bogotá (GMT-5)
            </span>
          </div>

          {loading ? (
            <p className="text-center text-gray">Cargando programación...</p>
          ) : (
            <>
              {/* Mobile accordion */}
              <div className="space-y-3 md:hidden">
                {FECHAS.map((fecha) => {
                  const isOpen = openDay === fecha;
                  const daySlots = query ? filtered.filter((s) => s.fecha === fecha) : grouped[fecha];
                  return (
                    <div
                      key={fecha}
                      className="overflow-hidden rounded-2xl border border-gold/20 bg-white"
                    >
                      <button
                        onClick={() => setOpenDay(isOpen ? null : fecha)}
                        className="flex w-full items-center justify-between bg-navy px-4 py-3 text-left"
                      >
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-gold md:text-xs">
                            {new Date(fecha + "T00:00:00-05:00").toLocaleDateString("es-CO", {
                              weekday: "long",
                              timeZone: "America/Bogota",
                            })}
                          </p>
                          <p className="font-serif text-lg font-bold text-cream md:text-xl">
                            {new Date(fecha + "T00:00:00-05:00").toLocaleDateString("es-CO", {
                              day: "numeric",
                              month: "long",
                              timeZone: "America/Bogota",
                            })}
                          </p>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gold" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gold" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="divide-y divide-gray/10">
                          {daySlots.map((slot) => (
                            <SlotRow key={slot.id} slot={slot} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop grid */}
              <div className="hidden grid-cols-3 gap-4 lg:gap-6 md:grid">
                {FECHAS.map((fecha) => (
                  <div
                    key={fecha}
                    className="overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-[0_8px_30px_rgba(27,58,92,0.08)]"
                  >
                    <div className="bg-navy px-4 py-3 text-center lg:px-5 lg:py-4">
                      <p className="text-[10px] uppercase tracking-wider text-gold lg:text-xs">
                        {new Date(fecha + "T00:00:00-05:00").toLocaleDateString("es-CO", {
                          weekday: "long",
                          timeZone: "America/Bogota",
                        })}
                      </p>
                      <p className="font-serif text-lg font-bold text-cream lg:text-xl">
                        {new Date(fecha + "T00:00:00-05:00").toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "long",
                          timeZone: "America/Bogota",
                        })}
                      </p>
                    </div>
                    <div className="max-h-[600px] overflow-y-auto lg:max-h-[700px]">
                      {(query ? filtered.filter((s) => s.fecha === fecha) : grouped[fecha]).map(
                        (slot) => (
                          <SlotRow key={slot.id} slot={slot} />
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
