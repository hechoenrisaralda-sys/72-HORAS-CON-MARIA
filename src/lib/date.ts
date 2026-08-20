import { format, parseISO } from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";

export const TIMEZONE = "America/Bogota";
export const EVENT_START_ISO = "2026-09-05T00:00:00-05:00";

export function nowInBogota() {
  return toZonedTime(new Date(), TIMEZONE);
}

export function formatBogotaDate(iso: string) {
  return formatInTimeZone(new Date(iso), TIMEZONE, "dd/MM/yyyy");
}

export function formatBogotaTime(iso: string) {
  return formatInTimeZone(new Date(iso), TIMEZONE, "HH:mm");
}

export function getSlotDateTime(fecha: string, horaInicio: string) {
  return `${fecha}T${horaInicio}:00-05:00`;
}

export function fechaColombia(fechaISO: string) {
  return formatInTimeZone(new Date(fechaISO), TIMEZONE, "d 'de' MMMM 'de' yyyy", { locale: undefined });
}

export function diaSemana(fechaISO: string) {
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return dias[new Date(fechaISO).getDay()];
}
