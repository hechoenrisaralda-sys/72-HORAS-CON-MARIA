import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fecha = searchParams.get("fecha");

  try {
    const slots = await prisma.slot.findMany({
      where: fecha ? { fecha } : undefined,
      orderBy: [{ fecha: "asc" }, { horaInicio: "asc" }],
      include: {
        custodio: {
          select: {
            tipo: true,
            tipoGrupo: true,
            nombreGrupo: true,
            ciudad: true,
            nombreResponsable: true,
          },
        },
      },
    });

    return NextResponse.json(slots);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al consultar slots" }, { status: 500 });
  }
}
