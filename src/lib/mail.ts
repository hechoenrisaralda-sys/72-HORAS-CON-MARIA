import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST || "smtp.gmail.com";
const port = Number(process.env.SMTP_PORT) || 465;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function verifyMailConnection() {
  return transporter.verify();
}

const from = `"72 Horas con María" <${process.env.EMAIL_FROM || "proyectos@fidatec.org.co"}>`;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://72horasconmaria.fidatec.org.co";

function nextDay(fecha: string): string {
  const [y, m, d] = fecha.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

function toCalendarDateTime(fecha: string, hora: string): string {
  return fecha.replace(/-/g, "") + "T" + hora.replace(":", "") + "00-0500";
}

function buildGoogleCalendarUrl(data: CustodioMailData): string {
  const endDate = data.horaFin === "00:00" ? nextDay(data.fecha) : data.fecha;
  const start = toCalendarDateTime(data.fecha, data.horaInicio);
  const end = toCalendarDateTime(endDate, data.horaFin === "00:00" ? "00:00" : data.horaFin);
  const title = encodeURIComponent(`72 Horas con María - Custodio de la hora ${data.horaInicio}`);
  const details = encodeURIComponent(
    `Has sido registrado como custodio de una Hora con María.\n\nFecha: ${data.fecha}\nHora: ${data.horaInicio} a ${data.horaFin} Hora de Bogotá (GMT-5)\nLugar: Salón Santuario, ExpoFuturo Pereira, Risaralda`
  );
  const location = encodeURIComponent("Salón Santuario, ExpoFuturo Pereira, Risaralda");
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&ctz=America/Bogota`;
}

export interface CustodioMailData {
  email: string;
  nombreResponsable: string;
  tipo: "grupo" | "individuo";
  tipoGrupo?: string | null;
  nombreGrupo?: string | null;
  ciudad?: string | null;
  fecha: string;
  horaInicio: string;
  horaFin: string;
}

function baseTemplate(content: string) {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', sans-serif; background: #F5F0E6; border-radius: 16px; overflow: hidden; border: 1px solid #E8D5A3;">
      <div style="background: #1B3A5C; padding: 32px; text-align: center;">
        <h1 style="font-family: 'Playfair Display', serif; color: #FFFFFF; margin: 0; font-size: 28px;">72 Horas con <span style="font-family: 'Great Vibes', cursive; color: #C9A84C;">María</span></h1>
        <div style="width: 80px; height: 2px; background: #C9A84C; margin: 16px auto 0;"></div>
      </div>
      <div style="padding: 32px; color: #1B3A5C;">
        ${content}
      </div>
      <div style="background: #1B3A5C; padding: 24px; text-align: center; color: #F5F0E6; font-size: 14px;">
        <p style="margin: 0;">📍 Salón Santuario, ExpoFuturo Pereira, Risaralda</p>
        <p style="margin: 8px 0 0;">Canal oficial: proyectos@fidatec.org.co</p>
        <p style="margin: 4px 0 0;">Fidatec · Hora de Bogotá (GMT-5)</p>
      </div>
    </div>
  `;
}

export async function sendConfirmationEmail(data: CustodioMailData) {
  const subject = `✅ Confirmación de tu registro – Custodio de una Hora con María`;
  const displayName =
    data.tipo === "grupo" && data.nombreGrupo
      ? `${data.nombreGrupo} (${data.nombreResponsable})`
      : data.nombreResponsable;

  const html = baseTemplate(`
    <p style="font-size: 16px;">Hola <strong>${data.nombreResponsable}</strong>,</p>
    <p style="font-size: 16px;">Tu registro como custodio ha sido exitoso. Estos son los detalles de tu Hora con María:</p>
    <div style="background: #FFFFFF; border: 1px solid #E8D5A3; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 8px; font-size: 16px;"><strong>Fecha:</strong> ${data.fecha}</p>
      <p style="margin: 0 0 8px; font-size: 16px;"><strong>Hora:</strong> ${data.horaInicio} a ${data.horaFin} Hora de Bogotá (GMT-5)</p>
      <p style="margin: 0 0 8px; font-size: 16px;"><strong>Tipo:</strong> ${data.tipo === "grupo" ? "Grupo" : "Individuo"}</p>
      ${data.tipo === "grupo" && data.tipoGrupo ? `<p style="margin: 0; font-size: 16px;"><strong>Tipo de grupo:</strong> ${data.tipoGrupo}</p>` : ""}
    </div>
    <p style="font-size: 16px;">Te comprometes a realizar el rezo del rosario durante la hora asignada y puedes acompañar con cantos, oraciones o cualquier práctica devocional.</p>
    <p style="font-size: 16px; margin-top: 16px;"><strong>Lugar:</strong> Salón Santuario, ExpoFuturo Pereira, Risaralda.</p>
    <p style="font-size: 16px; margin-top: 8px;">Puedes visitar el lugar de oración en cualquier hora desde las 00:00 hasta las 11:59 p.m.</p>
    <p style="font-size: 16px; margin-top: 24px;"><a href="${APP_URL}/programacion" style="background: #1B3A5C; color: #F5F0E6; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">Ver programación</a></p>
    <p style="font-size: 16px; margin-top: 16px;"><a href="${buildGoogleCalendarUrl(data)}" style="background: #C9A84C; color: #1B3A5C; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">📅 Agregar a Google Calendar</a></p>
    <p style="font-size: 16px; margin-top: 24px; font-style: italic;">"María, enséñanos a creer, a esperar y a amar sin medida."</p>
    <p style="font-size: 14px; color: #6B7280; margin-top: 24px;">Para ejercer tu derecho de supresión de datos, escríbenos a proyectos@fidatec.org.co.</p>
  `);

  await transporter.sendMail({
    from,
    to: data.email,
    subject,
    html,
  });
}

export async function sendReminderEmail(
  data: CustodioMailData,
  hoursLeft: number
) {
  const labels: Record<number, string> = {
    24: "⏰ Recordatorio: Tu Hora con María es mañana",
    12: "🔔 ¡Faltan 12 horas! Tu Hora con María se acerca",
    3: "🙏 ¡Es hoy! Tu Hora con María en 3 horas",
  };

  const messages: Record<number, string> = {
    24: "Mañana es tu Hora con María. Prepara el ambiente de oración, reúne a tu familia o comunidad y conéctate a la transmisión.",
    12: "Faltan pocas horas. Revisa tu correo, confirma la hora y ten a la mano el enlace a la transmisión en vivo.",
    3: "Es hoy. En 3 horas inicia tu tiempo de custodia. ¡María nos une!",
  };

  const html = baseTemplate(`
    <p style="font-size: 16px;">Hola <strong>${data.nombreResponsable}</strong>,</p>
    <p style="font-size: 16px;">${messages[hoursLeft]}</p>
    <div style="background: #FFFFFF; border: 1px solid #E8D5A3; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 8px; font-size: 16px;"><strong>Fecha:</strong> ${data.fecha}</p>
      <p style="margin: 0; font-size: 16px;"><strong>Hora:</strong> ${data.horaInicio} a ${data.horaFin} Hora de Bogotá (GMT-5)</p>
    </div>
    <p style="font-size: 16px; margin-top: 16px;"><strong>Lugar:</strong> Salón Santuario, ExpoFuturo Pereira, Risaralda. Puedes visitar el lugar de oración en cualquier hora desde las 00:00 hasta las 11:59 p.m.</p>
    <p style="font-size: 16px; margin-top: 24px;"><a href="${APP_URL}/transmision" style="background: #1B3A5C; color: #F5F0E6; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">Ir a la transmisión</a></p>
    <p style="font-size: 14px; color: #6B7280; margin-top: 24px;">Soporte: proyectos@fidatec.org.co</p>
  `);

  await transporter.sendMail({
    from,
    to: data.email,
    subject: labels[hoursLeft],
    html,
  });
}
