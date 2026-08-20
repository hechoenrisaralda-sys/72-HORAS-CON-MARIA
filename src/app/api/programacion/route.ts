import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const slots = await prisma.slot.findMany({
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
    return NextResponse.json({ error: "Error al consultar programación" }, { status: 500 });
  }
}
