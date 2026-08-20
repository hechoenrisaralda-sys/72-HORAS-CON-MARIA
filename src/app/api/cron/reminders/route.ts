import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReminderEmail } from "@/lib/mail";
import { getSlotDateTime } from "@/lib/date";
import { addHours, parseISO, differenceInHours } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

const TIMEZONE = "America/Bogota";

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret") || request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const now = toZonedTime(new Date(), TIMEZONE);
  const custodios = await prisma.custodio.findMany({
    where: { estado: "activo" },
    include: { slot: true },
  });

  const sent: string[] = [];

  for (const c of custodios) {
    if (!c.slot) continue;

    const slotStart = fromZonedTime(
      new Date(`${c.slot.fecha}T${c.slot.horaInicio}:00`),
      TIMEZONE
    );
    const hoursLeft = differenceInHours(slotStart, now);

    const shouldSend =
      (hoursLeft <= 24 && hoursLeft > 12 && !c.recordatorio24hEnviado) ||
      (hoursLeft <= 12 && hoursLeft > 3 && !c.recordatorio12hEnviado) ||
      (hoursLeft <= 3 && hoursLeft >= 0 && !c.recordatorio3hEnviado);

    if (!shouldSend) continue;

    const reminderType =
      hoursLeft <= 3 && hoursLeft >= 0 ? 3 : hoursLeft <= 12 ? 12 : 24;

    try {
      await sendReminderEmail(
        {
          email: c.email,
          nombreResponsable: c.nombreResponsable,
          tipo: c.tipo as "grupo" | "individuo",
          tipoGrupo: c.tipoGrupo,
          nombreGrupo: c.nombreGrupo,
          ciudad: c.ciudad,
          fecha: c.slot.fecha,
          horaInicio: c.slot.horaInicio,
          horaFin: c.slot.horaFin,
        },
        reminderType
      );

      await prisma.custodio.update({
        where: { id: c.id },
        data: {
          ...(reminderType === 24 && { recordatorio24hEnviado: true }),
          ...(reminderType === 12 && { recordatorio12hEnviado: true }),
          ...(reminderType === 3 && { recordatorio3hEnviado: true }),
        },
      });

      sent.push(`${c.email} - ${reminderType}h`);
    } catch (err) {
      console.error(`Error enviando recordatorio a ${c.email}`, err);
    }
  }

  return NextResponse.json({ ok: true, sent, count: sent.length });
}
