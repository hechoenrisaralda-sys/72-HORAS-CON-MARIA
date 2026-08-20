"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Users,
  User,
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

type Slot = {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: "disponible" | "ocupado";
  nombreDisplay?: string | null;
  custodio?: {
    nombreResponsable?: string;
    nombreGrupo?: string | null;
    ciudad?: string | null;
  } | null;
};

const FECHAS = ["2026-09-05", "2026-09-06", "2026-09-07"];
const TIPOS_GRUPO = [
  "Familia",
  "Parroquia",
  "Comunidad Religiosa",
  "Ministerio",
  "Misión",
  "Empresa",
  "Organización",
];

function formatFecha(fecha: string) {
  const d = new Date(fecha + "T00:00:00-05:00");
  return d.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Bogota",
  });
}

export default function InscripcionPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [tipo, setTipo] = useState<"grupo" | "individuo" | null>(null);
  const [form, setForm] = useState({
    tipoGrupo: "",
    nombreGrupo: "",
    ciudad: "",
    nombreResponsable: "",
    telefono: "",
    email: "",
  });
  const [checks, setChecks] = useState({ responsabilidad: false, datos: false });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/slots")
      .then((r) => r.json())
      .then((data) => {
        setSlots(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error cargando horarios");
        setLoading(false);
      });
  }, []);

  const canContinue = () => {
    if (step === 0) return !!selectedSlot;
    if (step === 1) return !!tipo;
    if (step === 2 && tipo === "grupo") {
      return form.tipoGrupo && form.nombreGrupo && form.ciudad;
    }
    if (step === 2) return true; // individuo no tiene subpaso adicional en este paso
    if (step === 3) {
      return form.nombreResponsable && form.telefono && form.email;
    }
    if (step === 4) return checks.responsabilidad && checks.datos;
    return false;
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/custodios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlot?.id,
          tipo,
          tipoGrupo: tipo === "grupo" ? form.tipoGrupo : null,
          nombreGrupo: tipo === "grupo" ? form.nombreGrupo : null,
          ciudad: tipo === "grupo" ? form.ciudad : null,
          nombreResponsable: form.nombreResponsable,
          telefono: form.telefono,
          email: form.email,
          aceptaResponsabilidad: true,
          aceptaDatos: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrar");
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center bg-navy px-5 py-12 text-center text-cream md:px-6 md:py-16">
          <div className="mx-auto w-full max-w-lg">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-white/10 md:mb-6 md:h-20 md:w-20">
              <Check className="h-8 w-8 text-gold md:h-10 md:w-10" />
            </div>
            <h1 className="font-serif text-2xl font-bold md:text-4xl">
              ¡Registro exitoso!
            </h1>
            <p className="mt-3 text-sm text-cream/80 md:mt-4 md:text-base">
              Hemos enviado un correo de confirmación a <strong>{form.email}</strong>.
            </p>
            <div className="mt-6 rounded-2xl border border-gold bg-cream p-5 text-navy md:mt-8 md:p-6">
              <p className="font-semibold">{formatFecha(selectedSlot!.fecha)}</p>
              <p className="mt-1 text-xl font-bold text-gold md:text-2xl">
                {selectedSlot!.horaInicio} a {selectedSlot!.horaFin}
              </p>
              <p className="mt-2 text-sm text-gray">
                Hora de Bogotá (GMT-5) · {tipo === "grupo" ? "Grupo" : "Individuo"}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-navy">
                <MapPin className="h-4 w-4 text-gold" />
                Salón Santuario, ExpoFuturo Pereira, Risaralda
              </p>
              <p className="mt-1 text-xs text-gray">
                Puedes visitar el lugar de oración en cualquier hora desde las 00:00
                hasta las 11:59 p.m.
              </p>
            </div>
            <a
              href="/"
              className="mt-6 inline-block rounded-xl bg-cream px-6 py-2.5 text-sm font-semibold text-navy transition hover:bg-white md:mt-8 md:px-8 md:py-3 md:text-base"
            >
              Volver al inicio
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-cream px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 text-center md:mb-8">
            <h1 className="font-serif text-2xl font-bold text-navy md:text-4xl">
              Elige una hora
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-gray md:mt-4 md:text-lg">
              Reúne a tu familia, parroquia, comunidad, grupo de oración, empresa,
              organización o tú mismo y conviértete en Guía de una Hora con{" "}
              <span className="font-script text-gold">María</span>.
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-6 flex items-center justify-center gap-1.5 md:mb-8 md:gap-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold md:h-10 md:w-10 md:text-sm ${
                  i <= step
                    ? "bg-gold text-navy"
                    : "border border-gold/40 text-gold"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 rounded-xl border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Paso 0: Selección de hora */}
          {step === 0 && (
            <>
              {loading ? (
                <p className="text-center text-gray">Cargando horarios...</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {FECHAS.map((fecha) => (
                    <div
                      key={fecha}
                      className="rounded-2xl border border-gold/20 bg-white p-4 shadow-[0_8px_30px_rgba(27,58,92,0.08)] md:p-5"
                    >
                      <div className="rounded-xl bg-navy px-3 py-2.5 text-center md:px-4 md:py-3">
                        <p className="text-[10px] uppercase tracking-wider text-gold md:text-xs">
                          {new Date(fecha + "T00:00:00-05:00").toLocaleDateString(
                            "es-CO",
                            { weekday: "long", timeZone: "America/Bogota" }
                          )}
                        </p>
                        <p className="font-serif text-lg font-bold text-cream md:text-xl">
                          {new Date(fecha + "T00:00:00-05:00").toLocaleDateString(
                            "es-CO",
                            { day: "numeric", month: "long", timeZone: "America/Bogota" }
                          )}
                        </p>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:mt-4 md:gap-2">
                        {slots
                          .filter((s) => s.fecha === fecha)
                          .map((s) => (
                            <button
                              key={s.id}
                              disabled={s.estado !== "disponible"}
                              onClick={() => setSelectedSlot(s)}
                              className={`rounded-lg px-1 py-2 text-xs font-medium transition md:px-2 md:py-3 md:text-sm ${
                                selectedSlot?.id === s.id
                                  ? "bg-gold text-navy ring-2 ring-navy"
                                  : s.estado === "disponible"
                                  ? "border border-gray/30 bg-white text-navy hover:border-gold"
                                  : "cursor-not-allowed bg-cream text-gray line-through"
                              }`}
                              title={
                                s.estado === "ocupado"
                                  ? `Ocupado: ${s.nombreDisplay || ""}`
                                  : "Disponible"
                              }
                            >
                              {s.horaInicio}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex justify-center">
                <span className="flex items-center gap-2 rounded-full border border-gold/40 bg-white px-4 py-2 text-sm font-semibold text-gold">
                  <Clock className="h-4 w-4" /> Hora de Bogotá (GMT-5)
                </span>
              </div>
            </>
          )}

          {/* Paso 1: Tipo de participante */}
          {step === 1 && (
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-6 text-center font-serif text-xl font-bold text-navy md:mb-8 md:text-2xl">
                ¿Eres un grupo o un individuo?
              </h2>
              <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                <button
                  onClick={() => setTipo("grupo")}
                  className={`flex flex-col items-center rounded-2xl border-2 p-5 text-center transition md:p-8 ${
                    tipo === "grupo"
                      ? "border-gold bg-white shadow-lg"
                      : "border-transparent bg-white hover:border-gold/40"
                  }`}
                >
                  <Users className="mb-3 h-8 w-8 text-navy md:mb-4 md:h-10 md:w-10" />
                  <h3 className="font-serif text-lg font-bold text-navy md:text-xl">Grupo</h3>
                  <p className="mt-2 text-sm text-gray">
                    Familia, parroquia, comunidad, ministerio, misión, empresa u
                    organización que se reúne para guiar el rezo del rosario.
                  </p>
                </button>
                <button
                  onClick={() => setTipo("individuo")}
                  className={`flex flex-col items-center rounded-2xl border-2 p-5 text-center transition md:p-8 ${
                    tipo === "individuo"
                      ? "border-gold bg-white shadow-lg"
                      : "border-transparent bg-white hover:border-gold/40"
                  }`}
                >
                  <User className="mb-3 h-8 w-8 text-navy md:mb-4 md:h-10 md:w-10" />
                  <h3 className="font-serif text-lg font-bold text-navy md:text-xl">Individuo</h3>
                  <p className="mt-2 text-sm text-gray">
                    Una sola persona que asume la responsabilidad de guiar el rezo
                    del rosario durante la hora asignada.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Paso 2: Datos específicos */}
          {step === 2 && (
            <div className="mx-auto max-w-xl rounded-2xl border border-gold/20 bg-white p-5 shadow-[0_8px_30px_rgba(27,58,92,0.08)] md:p-8">
              {tipo === "grupo" ? (
                <>
                  <label className="mb-2 block text-sm font-semibold text-navy">
                    Tipo de grupo
                  </label>
                  <select
                    className="mb-4 w-full rounded-xl border border-gray/30 px-4 py-3 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    value={form.tipoGrupo}
                    onChange={(e) =>
                      setForm({ ...form, tipoGrupo: e.target.value })
                    }
                  >
                    <option value="">Selecciona...</option>
                    {TIPOS_GRUPO.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <label className="mb-2 block text-sm font-semibold text-navy">
                    Nombre del grupo
                  </label>
                  <input
                    type="text"
                    className="mb-4 w-full rounded-xl border border-gray/30 px-4 py-3 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    placeholder="Ej. Familia Pérez"
                    value={form.nombreGrupo}
                    onChange={(e) =>
                      setForm({ ...form, nombreGrupo: e.target.value })
                    }
                  />
                  <label className="mb-2 block text-sm font-semibold text-navy">
                    Ciudad
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gold" />
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray/30 py-3 pl-10 pr-4 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                      placeholder="Ej. Bogotá"
                      value={form.ciudad}
                      onChange={(e) =>
                        setForm({ ...form, ciudad: e.target.value })
                      }
                    />
                  </div>
                </>
              ) : (
                <p className="text-center text-gray">
                  Como individuo, solo necesitamos tus datos de contacto en el
                  siguiente paso.
                </p>
              )}
            </div>
          )}

          {/* Paso 3: Datos de contacto */}
          {step === 3 && (
            <div className="mx-auto max-w-xl rounded-2xl border border-gold/20 bg-white p-5 shadow-[0_8px_30px_rgba(27,58,92,0.08)] md:p-8">
              <label className="mb-2 block text-sm font-semibold text-navy">
                Nombre completo del responsable
              </label>
              <input
                type="text"
                className="mb-4 w-full rounded-xl border border-gray/30 px-4 py-3 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                value={form.nombreResponsable}
                onChange={(e) =>
                  setForm({ ...form, nombreResponsable: e.target.value })
                }
              />
              <label className="mb-2 block text-sm font-semibold text-navy">
                Número de contacto
              </label>
              <div className="relative mb-4">
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gold" />
                <input
                  type="tel"
                  className="w-full rounded-xl border border-gray/30 py-3 pl-10 pr-4 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  value={form.telefono}
                  onChange={(e) =>
                    setForm({ ...form, telefono: e.target.value })
                  }
                />
              </div>
              <label className="mb-2 block text-sm font-semibold text-navy">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gold" />
                <input
                  type="email"
                  className="w-full rounded-xl border border-gray/30 py-3 pl-10 pr-4 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Paso 4: Confirmación */}
          {step === 4 && (
            <div className="mx-auto max-w-2xl">
              <div className="mb-5 rounded-xl border-l-4 border-gold bg-white p-4 text-navy shadow-sm md:mb-6 md:p-6">
                <p className="text-sm leading-relaxed md:text-base">
                  Al confirmar tu registro, te comprometes a cumplir con la hora
                  seleccionada ({formatFecha(selectedSlot!.fecha)} –{" "}
                  {selectedSlot!.horaInicio} a {selectedSlot!.horaFin} Hora de
                  Bogotá). Deberás realizar el rezo del rosario durante la hora
                  asignada y puedes acompañar con cantos, oraciones o cualquier
                  otra práctica devocional.
                </p>
              </div>

              <div className="space-y-3 rounded-2xl border border-gold/20 bg-white p-4 md:space-y-4 md:p-6">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 accent-gold"
                    checked={checks.responsabilidad}
                    onChange={(e) =>
                      setChecks({ ...checks, responsabilidad: e.target.checked })
                    }
                  />
                  <span className="text-sm text-navy">
                    Acepto la responsabilidad de cumplir con la hora asignada.
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 accent-gold"
                    checked={checks.datos}
                    onChange={(e) =>
                      setChecks({ ...checks, datos: e.target.checked })
                    }
                  />
                  <span className="text-sm text-navy">
                    Acepto el tratamiento de mis datos personales conforme a la
                    legislación colombiana (Ley 1581 de 2012 y Decreto 1377 de
                    2013).
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navegación */}
          <div className="mt-6 flex items-center justify-between md:mt-8">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-white disabled:opacity-30 md:px-5 md:py-3 md:text-base"
            >
              <ArrowLeft className="h-4 w-4" /> Atrás
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canContinue()}
                className="flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-gold hover:text-navy disabled:opacity-50 md:px-6 md:py-3 md:text-base"
              >
                Siguiente <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!canContinue() || submitting}
                className="flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-bold text-navy shadow-lg transition hover:bg-[#b8983e] disabled:opacity-50 md:px-8 md:py-4 md:text-lg"
              >
                {submitting ? "Confirmando..." : "Confirmar registro"}
                <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
