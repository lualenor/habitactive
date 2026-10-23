import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo Habitactive trata tus datos: mínimo necesario, privado por diseño y exportable.",
};

const contact =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "privacidad@habitactive.app";

export default function PrivacyPage() {
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
        <p className="eyebrow">Transparencia</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-ink sm:text-5xl">
          Privacidad
        </h1>
        <p className="mt-3 text-sm font-semibold text-ink-muted">
          Última actualización: octubre de 2026 · Aplica a esta instancia de
          Habitactive.
        </p>

        <div className="mt-8 space-y-7 text-[0.9rem] font-medium leading-relaxed text-ink-soft">
          <section>
            <h2 className="text-xl font-extrabold text-ink">1. La idea en una frase</h2>
            <p className="mt-2">
              Guardamos lo mínimo necesario para que tus hábitos funcionen.
              Tus hábitos, registros y correo son privados. En los retos solo
              compartes tu nombre y tu avance en ese reto.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-ink">2. Qué datos tratamos</h2>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-ink">Cuenta:</strong> nombre, correo,
                contraseña cifrada con bcrypt y zona horaria.
              </li>
              <li>
                <strong className="text-ink">Hábitos:</strong> nombre,
                descripción, área de vida, frecuencia, rachas y marcas de
                completado por día.
              </li>
              <li>
                <strong className="text-ink">Retos:</strong> retos que creas,
                retos a los que te unes y el avance que registras.
              </li>
              <li>
                <strong className="text-ink">Técnicos:</strong> cookies de sesión
                estrictamente necesarias. No usamos cookies publicitarias ni
                analítica de terceros por defecto.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-ink">3. Para qué los usamos</h2>
            <p className="mt-2">
              Para autenticarte, mostrar tu día, calcular rachas, gestionar tu
              participación en retos y permitirte exportar tus datos. No
              vendemos datos, no mostramos anuncios y no elaboramos perfiles
              publicitarios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-ink">4. Qué se comparte</h2>
            <p className="mt-2">
              En un reto público, las demás personas con cuenta pueden ver tu
              nombre, tu avance en ese reto y los retos a los que te unes. No
              pueden ver tus hábitos personales, tus registros diarios ni tu
              correo. Los retos marcados como privados solo son accesibles para
              sus participantes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-ink">5. Dónde se alojan</h2>
            <p className="mt-2">
              Esta instancia usa una base de datos PostgreSQL configurada por la
              persona u organización que la despliega. Si usas una instancia
              pública, consulta quién la opera. El código es abierto y puedes
              alojar tu propia copia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-ink">6. Tus derechos</h2>
            <p className="mt-2">
              Puedes descargar una copia de tus datos desde Ajustes → “Exportar
              mis datos”. También puedes solicitar la corrección o eliminación
              de tu cuenta escribiendo a{" "}
              <a
                href={`mailto:${contact}`}
                className="font-bold text-[#8A6512] underline decoration-[#D9B858] underline-offset-4"
              >
                {contact}
              </a>
              . Si la instancia es autogestionada, contacta a su responsable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-ink">7. Seguridad y retención</h2>
            <p className="mt-2">
              Las contraseñas se almacenan con bcrypt y las sesiones usan cookies
              HttpOnly firmadas. Conservamos los datos mientras tu cuenta exista.
              Al eliminar tu cuenta, se eliminan en cascada tus hábitos,
              registros y participaciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-ink">8. Menores</h2>
            <p className="mt-2">
              Habitactive no está dirigida a menores de 16 años. Si detectas una
              cuenta de un menor, contacta con la persona responsable de la
              instancia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-extrabold text-ink">9. Cambios</h2>
            <p className="mt-2">
              Si esta política cambia, actualizaremos la fecha superior. Los
              cambios sustanciales se comunicarán dentro de la app.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-[#F0E3C3] pt-6 text-sm font-bold">
          <Link href="/terms" className="text-[#8A6512] hover:text-ink">
            Términos de uso
          </Link>
          <Link href="/" className="text-ink-muted hover:text-ink">
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
