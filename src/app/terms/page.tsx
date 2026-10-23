import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Términos de uso",
  description:
    "Condiciones sencillas para usar Habitactive y cuidar a la comunidad.",
};

export default function TermsPage() {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-[#F0E3C3] bg-[#FFFDF5]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-4xl items-center justify-between px-5 sm:px-8">
          <Logo markSize={38} />
          <Link href="/register" className="btn-primary px-4 text-sm">
            Crear cuenta
          </Link>
        </div>
      </header>

      <main id="contenido" className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="eyebrow">Acuerdos claros</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-ink sm:text-5xl">
          Términos de uso
        </h1>
        <p className="mt-3 text-sm font-semibold text-ink-muted">
          Última actualización: octubre de 2026.
        </p>

        <div className="mt-8 space-y-7 text-[0.9rem] font-medium leading-relaxed text-ink-soft">
          <section>
            <h2 className="text-xl font-extrabold text-ink">1. Qué es Habitactive</h2>
            <p className="mt-2">
              Una aplicación open source para registrar hábitos, calcular rachas
              y participar en retos comunitarios. No es un servicio médico,
              psicológico ni financiero. La información que muestra es una ayuda
              para tu organización personal, no un consejo profesional.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-ink">2. Tu cuenta</h2>
            <p className="mt-2">
              Eres responsable de mantener la confidencialidad de tu contraseña y
              de la actividad de tu cuenta. Usa un correo propio y no compartas
              tu acceso. Puedes exportar tus datos o solicitar la eliminación de
              la cuenta en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-ink">3. Uso respetuoso</h2>
            <p className="mt-2">
              Al usar la comunidad, trato con respeto a las demás personas. No
              está permitido acosar, suplantar identidades, publicar contenido
              ilegal ni intentar acceder a datos de otras cuentas. Los retos son
              espacios de ánimo, no de competencia tóxica.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-ink">4. Contenido</h2>
            <p className="mt-2">
              Conservas la titularidad de lo que escribes. Al crear un reto
              público, permites que otras personas con cuenta lo vean y se unan.
              No publicamos tus hábitos privados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-ink">5. Disponibilidad</h2>
            <p className="mt-2">
              Habitactive se ofrece tal cual, sin garantía de disponibilidad
              continua. Puede haber mantenimientos, errores o pérdidas de
              conexión. Exporta tus datos si son importantes para ti.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-ink">6. Código y licencia</h2>
            <p className="mt-2">
              El código se distribuye bajo licencia MIT. Eso te permite usarlo,
              modificarlo y desplegarlo, conservando el aviso de licencia. La
              marca y el logo se incluyen como parte del proyecto y pueden
              adaptarse en tu propia instancia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-ink">7. Terminación</h2>
            <p className="mt-2">
              Puedes dejar de usar el servicio cuando quieras. La persona u
              organización que opera esta instancia puede suspender cuentas que
              incumplan estos términos o pongan en riesgo a la comunidad.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-[#F0E3C3] pt-6 text-sm font-bold">
          <Link href="/privacy" className="text-[#8A6512] hover:text-ink">
            Política de privacidad
          </Link>
          <Link href="/" className="text-ink-muted hover:text-ink">
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
