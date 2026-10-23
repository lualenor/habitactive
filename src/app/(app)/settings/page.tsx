import {
  Database,
  Download,
  KeyRound,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";

import {
  PasswordForm,
  ProfileForm,
  SignOutWide,
} from "@/components/settings/settings-forms";
import { Avatar } from "@/components/ui/avatar";
import { requireUser } from "@/lib/guards";

export const metadata: Metadata = {
  title: "Ajustes",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();
  const memberSince = new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: user.timeZone,
  }).format(user.createdAt);

  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <p className="eyebrow">Tu espacio, tus reglas</p>
        <h1 className="mt-2 text-[2.35rem] font-black leading-[1.02] tracking-[-0.055em] text-ink sm:text-[2.9rem]">
          Ajustes
        </h1>
        <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-ink-muted">
          Tu perfil, tu zona horaria y la seguridad de tu cuenta. Nada más de lo
          necesario.
        </p>
      </header>

      <section className="surface relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-14 -top-20 size-56 rounded-full bg-[#FFE8A8]/55 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} image={user.image} size="lg" />
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-ink">
                {user.name}
              </h2>
              <p className="mt-0.5 text-sm font-semibold text-ink-muted">
                {user.email}
              </p>
              <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-2.5 py-1 text-[0.62rem] font-extrabold text-[#8A6512]">
                <MapPin className="size-3" />
                {user.timeZone}
              </p>
            </div>
          </div>
          <p className="text-[0.65rem] font-semibold text-ink-faint">
            Miembro desde el {memberSince}
          </p>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <div className="space-y-5">
          <section className="surface p-5 sm:p-6" aria-labelledby="profile-title">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-cream-300 text-[#8A6512]">
                <UserRound className="size-4" />
              </span>
              <div>
                <h2 id="profile-title" className="text-lg font-black text-ink">
                  Perfil
                </h2>
                <p className="mt-0.5 text-xs font-semibold text-ink-muted">
                  Cómo te ven las personas en los retos.
                </p>
              </div>
            </div>
            <ProfileForm
              name={user.name}
              email={user.email}
              timeZone={user.timeZone}
            />
          </section>

          <section className="surface p-5 sm:p-6" aria-labelledby="password-title">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#EEF3DD] text-[#5E7131]">
                <KeyRound className="size-4" />
              </span>
              <div>
                <h2 id="password-title" className="text-lg font-black text-ink">
                  Seguridad
                </h2>
                <p className="mt-0.5 text-xs font-semibold text-ink-muted">
                  Cambia tu contraseña cuando lo necesites.
                </p>
              </div>
            </div>
            <PasswordForm />
          </section>
        </div>

        <aside className="space-y-4">
          <section className="surface p-5">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-cream-300 text-[#8A6512]">
                <Database className="size-4" />
              </span>
              <div>
                <h2 className="text-base font-black text-ink">
                  Tus datos, contigo
                </h2>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-muted">
                  Descarga una copia en JSON de tu perfil, hábitos, registros y
                  retos. No incluye contraseñas ni datos de otras personas.
                </p>
              </div>
            </div>
            <a
              href="/api/me/export"
              download
              className="btn-ghost mt-4 w-full"
            >
              <Download className="size-4" />
              Exportar mis datos
            </a>
          </section>

          <section className="rounded-[1.5rem] border border-[#EAD8A5] bg-[#FFF8E2] p-5">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-ink">
              <ShieldCheck className="size-4 text-[#8A6512]" />
              Privacidad por diseño
            </h2>
            <ul className="mt-3 space-y-2.5">
              {[
                "Tus hábitos y registros solo los ves tú.",
                "En comunidad se comparte únicamente tu avance en el reto.",
                "Tu correo nunca aparece en los retos.",
                "Puedes exportar tus datos cuando quieras.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-[0.68rem] font-semibold leading-relaxed text-ink-soft"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#D3A12D]" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="surface p-5">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-cream-200 text-[#8A6512]">
                <Smartphone className="size-4" />
              </span>
              <div>
                <h2 className="text-base font-black text-ink">
                  Llévala en tu teléfono
                </h2>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-ink-muted">
                  Habitactive es una PWA. En Chrome o Safari, usa “Añadir a la
                  pantalla de inicio” para abrirla como una app.
                </p>
              </div>
            </div>
          </section>

          <section className="surface p-5">
            <div className="flex items-center gap-2">
              <LockKeyhole className="size-4 text-ink-muted" />
              <h2 className="text-sm font-extrabold text-ink">Sesión</h2>
            </div>
            <p className="mt-1.5 text-xs font-semibold leading-relaxed text-ink-muted">
              Tu sesión caduca en 30 días. Si usas un dispositivo compartido,
              ciérrala al terminar.
            </p>
            <div className="mt-4">
              <SignOutWide />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
