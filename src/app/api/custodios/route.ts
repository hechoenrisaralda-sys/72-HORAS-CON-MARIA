import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendConfirmationEmail } from "@/lib/mail";
import { getSlotDateTime } from "@/lib/date";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slotId,
      tipo,
      tipoGrupo,
      nombreGrupo,
      ciudad,
      nombreResponsable,
      telefono,
      email,
      aceptaResponsabilidad,
      aceptaDatos,
    } = body;

    if (!slotId || !tipo || !nombreResponsable || !telefono || !email) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    if (tipo === "grupo" && (!tipoGrupo || !nombreGrupo || !ciudad)) {
      return NextResponse.json({ error: "Faltan datos del grupo" }, { status: 400 });
    }

    if (!aceptaResponsabilidad || !aceptaDatos) {
      return NextResponse.json(
        { error: "Debes aceptar los términos y el tratamiento de datos" },
        { status: 400 }
      );
    }

    const slot = await prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot || slot.estado !== "disponible") {
      return NextResponse.json({ error: "El slot no está disponible" }, { status: 409 });
    }

    const existing = await prisma.custodio.findFirst({
      where: { email, estado: "activo" },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Este correo ya tiene una Hora asignada. Cancelela primero para elegir otra." },
        { status: 409 }
      );
    }

    const display =
      tipo === "grupo"
        ? `${nombreGrupo} · ${nombreResponsable}${ciudad ? ` (${ciudad})` : ""}`
        : nombreResponsable;

    const result = await prisma.$transaction(async (tx) => {
      const custodio = await tx.custodio.create({
        data: {
          tipo,
          tipoGrupo: tipo === "grupo" ? tipoGrupo : null,
          nombreGrupo: tipo === "grupo" ? nombreGrupo : null,
          ciudad: tipo === "grupo" ? ciudad : null,
          nombreResponsable,
          telefono,
          email,
          fechaHoraAsignada: getSlotDateTime(slot.fecha, slot.horaInicio),
          aceptaResponsabilidad: true,
          aceptaDatos: true,
          estado: "activo",
        },
      });

      await tx.slot.update({
        where: { id: slotId },
        data: {
          estado: "ocupado",
          custodioId: custodio.id,
          nombreDisplay: display,
        },
      });

      return custodio;
    });

    try {
      await sendConfirmationEmail({
        email: result.email,
        nombreResponsable: result.nombreResponsable,
        tipo: result.tipo as "grupo" | "individuo",
        tipoGrupo: result.tipoGrupo,
        nombreGrupo: result.nombreGrupo,
        ciudad: result.ciudad,
        fecha: slot.fecha,
        horaInicio: slot.horaInicio,
        horaFin: slot.horaFin,
      });
    } catch (mailErr) {
      console.warn("No se pudo enviar el correo de confirmación:", mailErr);
    }

    return NextResponse.json({ success: true, custodio: result, emailSent: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al registrar custodio" }, { status: 500 });
  }
}
