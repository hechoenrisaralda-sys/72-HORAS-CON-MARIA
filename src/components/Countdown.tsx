"use client";

import { useEffect, useState } from "react";
import { formatDuration, intervalToDuration } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TIMEZONE = "America/Bogota";
const EVENT_START = "2026-09-05T00:00:00-05:00";

function pad(n?: number) {
  return String(n ?? 0).padStart(2, "0");
}

export default function Countdown() {
  const [now, setNow] = useState<Date | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => {
      const current = new Date();
      setNow(current);
      setLive(current >= new Date(EVENT_START));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  if (live) {
    return (
      <div className="flex flex-col items-center">
        <span className="mb-4 inline-flex animate-pulse items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-sm font-bold uppercase tracking-wider text-white">
          <span className="h-2.5 w-2.5 rounded-full bg-white" />
          En vivo
        </span>
        <p className="font-script text-3xl text-gold md:text-5xl">
          Las 72 Horas con María han comenzado
        </p>
      </div>
    );
  }

  const start = new Date(EVENT_START);
  const duration = intervalToDuration({ start: now, end: start });

  const blocks = [
    { label: "Días", value: duration.days ?? 0 },
    { label: "Horas", value: duration.hours ?? 0 },
    { label: "Minutos", value: duration.minutes ?? 0 },
    { label: "Segundos", value: duration.seconds ?? 0 },
  ];

  return (
    <div className="flex flex-col items-center">
      <p className="mb-6 font-script text-3xl text-gold md:text-4xl">
        Faltan para las 72 Horas con María
      </p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {blocks.map((b) => (
          <div
            key={b.label}
            className="flex h-28 w-28 flex-col items-center justify-center rounded-2xl border border-gold/30 bg-navy/60 backdrop-blur-sm md:h-36 md:w-36"
          >
            <span className="font-serif text-4xl font-bold text-gold md:text-6xl">
              {pad(b.value)}
            </span>
            <span className="mt-1 text-sm uppercase tracking-wider text-cream/80">
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
