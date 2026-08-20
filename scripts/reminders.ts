import cron from "node-cron";

const CRON_SECRET = process.env.CRON_SECRET || "dev-secret";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function runReminders() {
  const res = await fetch(`${APP_URL}/api/cron/reminders?secret=${CRON_SECRET}`);
  const json = await res.json();
  console.log("[reminders]", new Date().toISOString(), json);
}

// Runs at minute 0 of every hour
cron.schedule("0 * * * *", runReminders, {
  timezone: "America/Bogota",
});
console.log("Servicio de recordatorios iniciado. Zona horaria: America/Bogota");
