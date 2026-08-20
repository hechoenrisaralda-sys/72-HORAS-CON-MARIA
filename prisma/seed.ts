import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const fechas = ["2026-09-05", "2026-09-06", "2026-09-07"];

  for (const fecha of fechas) {
    for (let h = 0; h < 24; h++) {
      const inicio = `${String(h).padStart(2, "0")}:00`;
      const fin = `${String((h + 1) % 24).padStart(2, "0")}:00`;
      await prisma.slot.upsert({
        where: {
          fecha_horaInicio: { fecha, horaInicio: inicio },
        },
        update: {},
        create: {
          fecha,
          horaInicio: inicio,
          horaFin: fin,
          estado: "disponible",
        },
      });
    }
  }

  await prisma.configuracionEvento.upsert({
    where: { clave: "fecha_inicio" },
    update: {},
    create: {
      clave: "fecha_inicio",
      valor: "2026-09-05T00:00:00-05:00",
      descripcion: "Inicio del evento en hora de Bogotá GMT-5",
    },
  });

  await prisma.configuracionEvento.upsert({
    where: { clave: "zona_horaria" },
    update: {},
    create: {
      clave: "zona_horaria",
      valor: "America/Bogota",
      descripcion: "Zona horaria oficial del evento",
    },
  });

  console.log("Seed completado: 72 slots creados.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
