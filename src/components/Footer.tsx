import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-navy py-8 text-cream md:py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold">
              72 Horas con <span className="font-script text-gold">María</span>
            </h3>
            <p className="mt-2 text-sm text-cream/70">
              Una cadena de amor que nunca se detiene.
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-gold">
              <span className="text-gold">📍</span>
              Salón Santuario, ExpoFuturo Pereira, Risaralda
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-cream/80">Canal oficial:</p>
            <a
              href="mailto:proyectos@fidatec.org.co"
              className="text-gold hover:underline"
            >
              proyectos@fidatec.org.co
            </a>
            <div className="mt-3 flex justify-center gap-4 md:justify-end">
              <Link href="/" className="text-sm text-cream/70 hover:text-gold">
                Inicio
              </Link>
              <Link
                href="/programacion"
                className="text-sm text-cream/70 hover:text-gold"
              >
                Programación
              </Link>
              <Link
                href="/privacidad"
                className="text-sm text-cream/70 hover:text-gold"
              >
                Privacidad
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gold/20 pt-6 text-center text-xs text-cream/50">
          © {new Date().getFullYear()} Fidatec. Todos los derechos reservados.
          Zona horaria: GMT-5 (Hora de Bogotá, Colombia).
        </div>
      </div>
    </footer>
  );
}
