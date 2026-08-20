import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacidadPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-cream px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gold/20 bg-white p-8 shadow-[0_8px_30px_rgba(27,58,92,0.08)] md:p-12">
          <h1 className="font-serif text-3xl font-bold text-navy md:text-4xl">
            Política de tratamiento de datos personales
          </h1>
          <div className="mb-6 mt-4 h-1 w-20 bg-gold" />

          <section className="space-y-6 text-navy/80">
            <div>
              <h2 className="mb-2 font-serif text-xl font-bold text-navy">
                1. Responsable del tratamiento
              </h2>
              <p>
                Fidatec, identificada como entidad organizadora del evento{" "}
                <em>72 Horas con María</em>, es responsable del tratamiento de los
                datos personales recolectados a través de este portal.
              </p>
              <p className="mt-2">
                <strong>Canal oficial:</strong>{" "}
                <a
                  href="mailto:proyectos@fidatec.org.co"
                  className="text-gold hover:underline"
                >
                  proyectos@fidatec.org.co
                </a>
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-serif text-xl font-bold text-navy">
                2. Datos recolectados
              </h2>
              <p>
                Para la inscripción de guías se solicita: tipo de
                participante, nombre del grupo (si aplica), ciudad, nombre del
                responsable, número de contacto y correo electrónico.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-serif text-xl font-bold text-navy">
                3. Finalidad
              </h2>
              <p>
                Los datos se usarán exclusivamente para la organización del evento,
                asignación de horarios, envío de recordatorios y comunicación
                institucional relacionada con las <em>72 Horas con María</em>.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-serif text-xl font-bold text-navy">
                4. Base legal
              </h2>
              <p>
                El tratamiento se realiza conforme a la Ley 1581 de 2012, el
                Decreto 1377 de 2013 y demás normas colombianas sobre protección de
                datos personales.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-serif text-xl font-bold text-navy">
                5. Derechos del titular
              </h2>
              <p>
                Como titular de tus datos personales tienes derecho a conocer,
                actualizar, rectificar, suprimir y revocar la autorización para el
                tratamiento de tus datos.
              </p>
              <p className="mt-2">
                Para ejercer estos derechos, escríbenos a{" "}
                <a
                  href="mailto:proyectos@fidatec.org.co"
                  className="text-gold hover:underline"
                >
                  proyectos@fidatec.org.co
                </a>{" "}
                con el asunto &quot;Derecho de petición datos personales&quot;.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-serif text-xl font-bold text-navy">
                6. Vigencia
              </h2>
              <p>
                Los datos se conservarán mientras dure la organización del evento
                y los plazos legales posteriores para atención de consultas y
                reclamos. Finalizado el plazo, serán suprimidos de forma segura.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
