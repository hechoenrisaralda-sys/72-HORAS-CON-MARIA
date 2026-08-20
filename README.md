# Portal Web — 72 Horas con María

Portal oficial para el evento de oración continua organizado por Fidatec. Permite la inscripción de custodios, la consulta pública de la programación de 72 horas y el acceso a la transmisión en vivo.

## Tecnologías

- **Framework:** Next.js 16 (App Router + React 19)
- **Estilos:** Tailwind CSS 4
- **Base de datos:** Prisma + SQLite (desarrollo) / PostgreSQL (producción)
- **Correos:** Nodemailer + Gmail app password (SMTP)
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

- **Home:** 3 tarjetas principales (inscripción, programación, transmisión) + aviso de entrada libre.
- **Inscripción:** selección de slot entre 72 horas, tipo de participante (grupo/individuo), formulario multi-paso y confirmación.
- **Programación:** vista de 3 días con 24 slots cada uno, filtros, indicador GMT-5.
- **Transmisión:** contador regresivo al 5 de septiembre de 2026, 00:00 GMT-5.
- **Lugar:** Salón Santuario, ExpoFuturo Pereira, Risaralda. Visitas al lugar de oración disponibles las 24 horas (00:00 – 11:59 p.m.).
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

El archivo `render.yaml` ya tiene la configuración lista. Pasos:

1. En el dashboard de Render, crea un **Blueprint** seleccionando el repositorio.
2. Render creará automáticamente:
   - Web Service `portal-72-horas`
   - Base de datos PostgreSQL `db-72-horas`
   - Cron Job `reminders-72-horas`
3. Configura las variables de entorno que faltan en el dashboard:
   - `SMTP_PASS` → app password de Gmail
   - `CRON_SECRET` → generar o copiar del servicio web
   - Verifica `NEXT_PUBLIC_APP_URL` con tu dominio real
4. Ejecuta una migración inicial en el Web Service (shell):
   ```bash
   npm run db:push
   ```
5. Ejecuta el seed para crear los 72 slots:
   ```bash
   npm run db:seed
   ```

## Notas sobre imágenes

El proyecto incluye placeholders vectoriales y un componente de fondo hero generado por código. Para reemplazarlos por imágenes promocionales reales, coloca los archivos en `/public` y actualiza las referencias en los componentes.

## Licencia

Fidatec — Todos los derechos reservados.
