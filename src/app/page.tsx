import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroBackground from "@/components/HeroBackground";
import { FileText, Calendar, Radio, ArrowRight, MapPin } from "lucide-react";

export default function Home() {
  const cards = [
    {
      icon: FileText,
      title: "Inscripción para el Guía del Rezo del Rosario",
      description:
        "Inscríbete como guía de una hora específica. Reúne a tu familia, parroquia, comunidad o empresa.",
      href: "/inscripcion",
      cta: "Ser guía",
    },
    {
      icon: Calendar,
      title: "Ver Programación",
      description:
        "Consulta los 3 días del evento con sus 72 horas de oración. Encuentra el guía de cada Hora de María.",
      href: "/programacion",
      cta: "Ver programación",
    },
    {
      icon: Radio,
      title: "Transmisión en Vivo",
      description:
        "Accede a la transmisión del evento y al contador regresivo para las 72 Horas con María.",
      href: "/transmision",
      cta: "Ir a la transmisión",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[480px] flex-col items-center justify-center px-5 py-16 text-center text-cream md:min-h-[520px] md:px-6 md:py-24">
        <HeroBackground />
        <div className="relative z-10 w-full max-w-4xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-gold md:mb-4 md:text-sm">
            Una cadena de amor que nunca se detiene
          </p>
          <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
            72 Horas con <span className="font-script text-gold">María</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl font-serif text-lg md:mt-6 md:text-2xl">
            Vigilia de oración · Santo Rosario sin pausa
          </p>
          <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-2xl border border-gold/40 bg-navy/50 px-5 py-2.5 backdrop-blur-sm md:mt-8 md:px-6 md:py-3">
            <Calendar className="h-5 w-5 text-gold" />
            <span className="font-medium">5, 6 y 7 de septiembre de 2026</span>
          </div>
          <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-white/10 px-4 py-2 text-sm text-cream/90 md:mt-4 md:text-base">
            <MapPin className="h-4 w-4 text-gold" />
            <span>Salón Santuario, ExpoFuturo Pereira, Risaralda</span>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cream/80 md:text-base">
            Durante 72 horas continuas de rezo del Rosario.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base font-bold leading-relaxed text-cream md:text-lg">
            Si deseas participar como asistente, puedes hacerlo en cualquiera de las
            horas del 5 al 7 de septiembre sin necesidad de inscribirte. También
            puedes visitar el lugar de oración en cualquier hora desde las 00:00
            hasta las 11:59 p.m.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-cream/80 md:text-base">
            Solo se inscriben quienes quieran ser guías de cada una de las Horas
            de María. La entrada es libre y puedes ver quién es el guía de cada
            hora en la programación.
          </p>
        </div>
      </section>

      {/* Tarjetas */}
      <main className="flex-1 bg-cream px-5 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex flex-col rounded-2xl border border-gold/20 bg-white p-6 shadow-[0_8px_30px_rgba(27,58,92,0.12)] transition hover:-translate-y-1 hover:border-gold hover:shadow-[0_8px_30px_rgba(201,168,76,0.18)] md:p-8"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold bg-cream md:mb-6 md:h-16 md:w-16">
                  <card.icon className="h-6 w-6 text-navy md:h-7 md:w-7" />
                </div>
                <h3 className="mb-3 font-serif text-xl font-bold text-navy md:text-2xl">
                  {card.title}
                </h3>
                <p className="mb-5 flex-1 text-sm text-gray md:text-base">
                  {card.description}
                </p>
                <span className="inline-flex items-center gap-2 self-start rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-cream transition group-hover:bg-gold group-hover:text-navy md:px-5 md:py-3">
                  {card.cta} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
