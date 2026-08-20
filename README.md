# Portal Web — 72 Horas con María

Portal oficial para el evento de oración continua organizado por Fidatec. Permite la inscripción de custodios, la consulta pública de la programación de 72 horas y el acceso a la transmisión en vivo.

🌐 **URL oficial:** [https://72horasconmaria.fidatec.org.co](https://72horasconmaria.fidatec.org.co)

📅 **Evento:** 5, 6 y 7 de septiembre de 2026 · Salón Santuario, ExpoFuturo Pereira, Risaralda

✅ **Estado:** Portal desplegado en producción y listo para recibir inscripciones.

## Tecnologías

- **Framework:** Next.js 16 (App Router + React 19)
- **Estilos:** Tailwind CSS 4
- **Base de datos:** Prisma + PostgreSQL (producción en Render)
- **Correos:** Nodemailer + Gmail app password (SMTP)
- **Despliegue:** Render (Web Service + Cron Job + PostgreSQL)
- **Tipografías:** Playfair Display, Great Vibes, Inter, Cormorant Garamond, Dancing Script, Open Sans
- **Despliegue recomendado:** Render (Web Service + Cron Job)

## Requisitos

- Node.js 18+
- npm

## Instalación local

1. Clonar e instalar dependencias:

```bash
cd portal-72-horas
npm install
```

2. Copiar variables de entorno:

```bash
cp .env.example .env.local
```

3. Generar el cliente de Prisma, crear la base de datos y sembrar los 72 slots:

```bash
npm run db:push
npm run db:seed
```

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

El portal estará disponible en [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable | Descripción | Local / Producción |
|---|---|---|
| `DATABASE_URL` | URL de la base de datos | SQLite local / PostgreSQL de Render |
| `SMTP_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Puerto SMTP | `465` |
| `SMTP_USER` | Correo remitente | `proyectos@fidatec.org.co` |
| `SMTP_PASS` | **App password** de Gmail (16 caracteres) | Generar en Google Account |
| `EMAIL_FROM` | Remitente oficial | `proyectos@fidatec.org.co` |
| `NEXT_PUBLIC_APP_URL` | URL pública del portal | `http://localhost:3000` / URL de Render |
| `CRON_SECRET` | Secreto para el endpoint de recordatorios | Generar valor seguro |
| `TZ` | Zona horaria | `America/Bogota` |
| `EVENT_START_UTC` | Inicio del evento en UTC | `2026-09-05T05:00:00.000Z` |

### Configurar Gmail app password

1. Activa la **verificación en dos pasos** en la cuenta de Google de `proyectos@fidatec.org.co`.
2. Ve a **Seguridad > Contraseñas de aplicaciones**.
3. Genera una contraseña de app para “Correo”.
4. Copia los 16 caracteres y pégala en la variable `SMTP_PASS` de Render (no uses la contraseña normal de Gmail).

## Flujos implementados

- **Home:** 3 tarjetas principales (inscripción, programación, transmisión) + aviso de entrada libre y horario del lugar de oración.
- **Inscripción:** selección de slot entre 72 horas, tipo de participante (grupo/individuo), formulario multi-paso y confirmación.
- **Programación:** vista de 3 días con 24 slots cada uno; slots disponibles muestran botón para ser custodio.
- **Transmisión:** contador regresivo al 5 de septiembre de 2026, 00:00 GMT-5.
- **Correo de confirmación:** incluye datos del registro, responsabilidades, enlace a programación y botón para **agregar el evento a Google Calendar**.
- **Lugar:** Salón Santuario, ExpoFuturo Pereira, Risaralda. El lugar de oración puede visitarse en cualquier hora desde las 00:00 hasta las 11:59 p.m.
- **Contacto:** canal oficial por correo y números de WhatsApp en el footer.
- **Política de privacidad:** página dedicada con información del tratamiento de datos.

## Recordatorios automáticos

El sistema envía 4 correos:

1. **Confirmación de registro** — inmediato tras completar el formulario.
2. **Recordatorio 24h** — 24 horas antes de la Hora asignada.
3. **Recordatorio 12h** — 12 horas antes.
4. **Recordatorio 3h** — 3 horas antes.

En producción, Render ejecuta el cron cada hora y llama al endpoint:

```
GET /api/cron/reminders
x-cron-secret: <CRON_SECRET>
```

En local puedes probarlo con:

```bash
npm run reminders
```

## Producción en Render

El portal ya está desplegado en producción mediante el archivo `render.yaml`.

### Estado actual

- **Web Service:** `portal-72-horas` (plan Starter)
- **Base de datos:** PostgreSQL `db-72-horas` (plan Basic-256mb)
- **Cron Job:** `reminders-72-horas` (cada hora)
- **URL pública:** [https://72horasconmaria.fidatec.org.co](https://72horasconmaria.fidatec.org.co)
- **Dominio personalizado:** configurado en Render (`72horasconmaria.fidatec.org.co`)

### Variables de entorno configuradas

| Variable | Valor actual |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://72horasconmaria.fidatec.org.co` |
| `EMAIL_FROM` | `proyectos@fidatec.org.co` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `proyectos@fidatec.org.co` |
| `SMTP_PASS` | *App password de Gmail* |
| `CRON_SECRET` | *Valor seguro compartido entre Web Service y Cron Job* |
| `TZ` | `America/Bogota` |

### Pasos para recrear el despliegue

1. En el dashboard de Render, crea un **Blueprint** seleccionando el repositorio.
2. Render creará automáticamente:
   - Web Service `portal-72-horas`
   - Base de datos PostgreSQL `db-72-horas`
   - Cron Job `reminders-72-horas`
3. Configura las variables de entorno sensibles en el dashboard (mismo valor en Web Service y Cron Job):
   - `SMTP_PASS` → app password de Gmail
   - `CRON_SECRET` → contraseña segura
4. Ejecuta en la shell del Web Service:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

### Base de datos

- Esquema sincronizado con PostgreSQL.
- 72 slots creados (3 días × 24 horas) mediante `npm run db:seed`.
- Recordatorios de correo se envían automáticamente cada hora vía cron job.

## Identidad visual

- **Paleta:** azul marino `#1B3A5C`, dorado `#C9A84C`, crema `#F5F0E6`.
- **Tipografías:** Playfair Display, Great Vibes, Inter, Cormorant Garamond, Dancing Script, Open Sans.
- **Favicon:** `M` cursiva dorada dentro de círculo dorado con fondo azul marino.

## Notas sobre imágenes

El hero usa un fondo generado por código (gradientes y luces sutiles). Para agregar una imagen promocional real, coloca el archivo en `/public` y actualiza el componente `HeroBackground`.

## Licencia

Fidatec — Todos los derechos reservados.
