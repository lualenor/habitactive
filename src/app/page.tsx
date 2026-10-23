import {
  ArrowRight,
  CalendarDays,
  Check,
  Flame,
  Github,
  Heart,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  WifiOff,
} from "lucide-react";
import Link from "next/link";

import { Logo, LogoMark } from "@/components/brand/logo";
import { CategoryIcon } from "@/components/ui/category-icon";

export default function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-[-18rem] -z-10 size-[60rem] -translate-x-1/2 rounded-full bg-[#FFF0BE]/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-52 top-[42rem] -z-10 size-[38rem] rounded-full bg-[#F6E7B6]/45 blur-3xl" />

      <header className="sticky top-0 z-50 border-b border-transparent bg-[#FFFDF5]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo markSize={40} />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            <Link href="#como-funciona" className="btn-quiet text-sm">
              Cómo funciona
            </Link>
            <Link href="#comunidad" className="btn-quiet text-sm">
              Comunidad
            </Link>
            <Link href="#open-source" className="btn-quiet text-sm">
              Open source
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-extrabold text-ink-soft transition hover:bg-cream-200 hover:text-ink sm:inline-flex"
            >
              Iniciar sesión
            </Link>
            <Link href="/register" className="btn-primary hidden px-4 sm:inline-flex sm:px-5">
              Empezar gratis
              <ArrowRight className="size-4" />
            </Link>
            <details className="relative md:hidden">
              <summary
                className="icon-button size-11 cursor-pointer list-none"
                aria-label="Abrir menú"
              >
                <Menu className="size-5" />
              </summary>
              <div className="absolute right-0 top-14 w-56 rounded-3xl border border-[#F0E2B6] bg-cream-100 p-2 shadow-lift">
                <Link href="/register" className="block rounded-2xl px-4 py-3 text-sm font-extrabold text-[#8A6512] hover:bg-cream-200">
                  Crear mi cuenta
                </Link>
                <Link href="#como-funciona" className="block rounded-2xl px-4 py-3 text-sm font-bold text-ink-soft hover:bg-cream-200">
                  Cómo funciona
                </Link>
                <Link href="#comunidad" className="block rounded-2xl px-4 py-3 text-sm font-bold text-ink-soft hover:bg-cream-200">
                  Comunidad
                </Link>
                <Link href="/login" className="block rounded-2xl px-4 py-3 text-sm font-bold text-ink-soft hover:bg-cream-200">
                  Iniciar sesión
                </Link>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main id="contenido">
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-20">
          <div className="relative z-10 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E7D3A0] bg-cream-100/80 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.17em] text-[#8A6512] shadow-sm">
              <Sparkles className="size-3.5" />
              PWA open source · Hecha para durar
            </span>

            <h1 className="mt-6 max-w-[46rem] text-balance text-[3.4rem] font-black leading-[0.98] tracking-[-0.06em] text-ink sm:text-[4.4rem] lg:text-[5rem]">
              Hábitos que
              <br />
              <span className="relative inline-block text-[#B88916]">
                florecen
                <svg
                  className="absolute -bottom-2 left-0 w-full text-[#F0CF78]"
                  viewBox="0 0 300 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 11C61 3 112 3 158 7C205 11 254 10 296 5"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              en comunidad.
            </h1>

            <p className="mt-7 max-w-xl text-pretty text-lg font-semibold leading-relaxed text-ink-soft sm:text-xl">
              Un espacio privado para construir tus rachas y una comunidad para
              los retos que te impulsan. Sin ruido, sin culpa, sin comparar tu
              proceso con el de nadie.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/register" className="btn-dark px-7 py-3.5 text-base">
                Crear mi espacio gratis
                <ArrowRight className="size-4" />
              </Link>
              <Link href="#como-funciona" className="btn-ghost px-6 py-3.5 text-base">
                Ver cómo funciona
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold text-ink-muted">
              <span className="inline-flex items-center gap-2">
                <Check className="size-4 text-[#7C9A4A]" />
                Sin tarjeta
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#7C9A4A]" />
                Datos privados
              </span>
              <span className="inline-flex items-center gap-2">
                <WifiOff className="size-4 text-[#7C9A4A]" />
                Funciona offline
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[27rem] animate-fade-up [animation-delay:120ms] lg:mr-0">
            <div className="absolute -left-10 top-20 hidden -rotate-6 rounded-3xl border border-[#ECD9A6] bg-cream-100 px-5 py-4 shadow-lift sm:block">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-[#FFF0BE] text-[#B88916]">
                  <Flame className="size-5" />
                </span>
                <div>
                  <p className="text-[0.65rem] font-extrabold uppercase tracking-wider text-ink-muted">
                    Racha actual
                  </p>
                  <p className="text-lg font-black text-ink">12 días</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-24 z-20 rotate-3 rounded-3xl border border-[#E5CE8F] bg-white px-5 py-4 shadow-lift sm:-right-12">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-[#E8EFCF] text-[#5E7131]">
                  <Users className="size-5" />
                </span>
                <div>
                  <p className="text-[0.65rem] font-extrabold uppercase tracking-wider text-ink-muted">
                    Reto en comunidad
                  </p>
                  <p className="text-lg font-black text-ink">21 días de calma</p>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-[19.5rem] rounded-[2.7rem] border-[7px] border-[#3B311C] bg-[#FFFDF5] p-2 shadow-[0_40px_80px_-40px_rgba(61,49,20,0.65)] sm:w-[21.5rem]">
              <div className="absolute left-1/2 top-3 h-5 w-24 -translate-x-1/2 rounded-full bg-[#3B311C]" />
              <div className="overflow-hidden rounded-[2.1rem] bg-[#FFFDF5]">
                <div className="flex items-center justify-between bg-[#FFEFBD] px-4 pb-3 pt-5">
                  <div className="flex items-center gap-2">
                    <LogoMark size={29} />
                    <span className="text-sm font-black tracking-tight text-ink">
                      Habitactive
                    </span>
                  </div>
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#E9B93E] text-[0.62rem] font-black text-[#4B3A0A]">
                    LR
                  </span>
                </div>

                <div className="space-y-4 px-4 py-5">
                  <div>
                    <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#9A7B2D]">
                      Miércoles, 21 de octubre
                    </p>
                    <h2 className="mt-1 text-[1.55rem] font-black leading-tight tracking-[-0.04em] text-ink">
                      Buenas tardes, Luis
                    </h2>
                  </div>

                  <div className="rounded-[1.4rem] border border-[#F2E3BC] bg-[#FFF8E2] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.15em] text-[#9A7B2D]">
                          Hoy
                        </p>
                        <p className="mt-1 text-3xl font-black tracking-[-0.05em] text-ink">
                          3<span className="text-base text-ink-muted"> / 4</span>
                        </p>
                        <p className="mt-0.5 text-[0.65rem] font-bold text-ink-muted">
                          hábitos completados
                        </p>
                      </div>
                      <div className="relative flex size-16 items-center justify-center">
                        <svg className="size-16 -rotate-90" viewBox="0 0 64 64">
                          <circle cx="32" cy="32" r="27" fill="none" stroke="#F8E8B9" strokeWidth="7" />
                          <circle
                            cx="32"
                            cy="32"
                            r="27"
                            fill="none"
                            stroke="#E9B93E"
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeDasharray="169.6"
                            strokeDashoffset="42.4"
                          />
                        </svg>
                        <Flame className="absolute size-5 text-[#B88916]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      {
                        name: "Meditar 10 minutos",
                        category: "SPIRITUAL" as const,
                        done: true,
                        streak: 12,
                      },
                      {
                        name: "Leer 20 páginas",
                        category: "INTELLECTUAL" as const,
                        done: true,
                        streak: 8,
                      },
                      {
                        name: "Caminar 30 minutos",
                        category: "PHYSICAL" as const,
                        done: true,
                        streak: 5,
                      },
                      {
                        name: "Llamar a alguien querido",
                        category: "SOCIAL" as const,
                        done: false,
                        streak: 3,
                      },
                    ].map((habit) => (
                      <div
                        key={habit.name}
                        className="flex items-center gap-3 rounded-2xl border border-[#F3E7CA] bg-white/80 p-2.5"
                      >
                        <span
                          className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${
                            habit.done
                              ? "border-[#E0B13C] bg-[#E9B93E] text-[#4B3A0A]"
                              : "border-[#E7D7B2] bg-white"
                          }`}
                        >
                          {habit.done && <Check className="size-4" strokeWidth={3} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[0.7rem] font-extrabold text-ink">
                            {habit.name}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-[0.56rem] font-bold text-ink-muted">
                            <CategoryIcon
                              category={habit.category}
                              className="size-2.5"
                            />
                            {habit.streak} días de racha
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-around border-t border-[#F0E3C3] bg-white/85 px-5 pb-4 pt-3">
                  <span className="flex size-9 items-center justify-center rounded-2xl bg-[#FFE8A8] text-[#8A6512]">
                    <Sparkles className="size-4" />
                  </span>
                  <CalendarDays className="size-4 text-ink-faint" />
                  <Users className="size-4 text-ink-faint" />
                  <span className="size-4 rounded-full border border-ink-faint" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#F0E3C3] bg-cream-100/60">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4 sm:px-8">
            {[
              { value: "100%", label: "Open source, licencia MIT" },
              { value: "0", label: "Anuncios o venta de datos" },
              { value: "4", label: "Áreas de vida para crecer" },
              { value: "∞", label: "Retos por descubrir" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-2xl font-black tracking-[-0.04em] text-ink sm:text-3xl">
                  {item.value}
                </span>
                <span className="text-[0.68rem] font-bold leading-snug text-ink-muted sm:text-xs">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow">Simple por dentro, profundo por fuera</p>
            <h2 className="mt-3 text-balance text-[2.5rem] font-black leading-[1.05] tracking-[-0.05em] text-ink sm:text-5xl">
              Tu día, en cuatro dimensiones.
            </h2>
            <p className="mt-4 text-lg font-semibold leading-relaxed text-ink-soft">
              No necesitas hacerlo todo. Necesitas elegir lo que importa y
              volver a ello. Habitactive te ayuda a ver el conjunto sin perder
              el detalle.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                category: "SPIRITUAL" as const,
                title: "Espíritu",
                copy: "Calma, gratitud y propósito. Lo que te centra.",
              },
              {
                category: "INTELLECTUAL" as const,
                title: "Mente",
                copy: "Aprender, leer, crear. Curiosidad con constancia.",
              },
              {
                category: "PHYSICAL" as const,
                title: "Cuerpo",
                copy: "Movimiento, descanso y energía para sostener el resto.",
              },
              {
                category: "SOCIAL" as const,
                title: "Vínculos",
                copy: "Presencia, generosidad y tiempo con quien importa.",
              },
            ].map((item, index) => (
              <article
                key={item.category}
                className="group rounded-[1.8rem] border border-[#F0E2B6] bg-white/70 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-cream-300 text-[#8A6512]">
                    <CategoryIcon category={item.category} className="size-5" />
                  </span>
                  <span className="text-[0.65rem] font-black text-ink-faint">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-black text-ink">{item.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-ink-muted">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 grid items-center gap-8 rounded-[2.5rem] border border-[#F0E2B6] bg-[#FFF8E2] p-6 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:p-14">
            <div>
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-white text-[#B88916] shadow-sm">
                <Flame className="size-6" />
              </span>
              <h3 className="mt-5 text-balance text-3xl font-black leading-tight tracking-[-0.04em] text-ink sm:text-4xl">
                Rachas que respetan tu vida.
              </h3>
              <p className="mt-3 max-w-md text-base font-semibold leading-relaxed text-ink-soft">
                Tu racha no se rompe por un día que aún no termina. Y si fallas,
                puedes volver sin dramas. La constancia se construye, no se
                castiga.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Fechas locales inmunes a cambios de zona horaria y DST.",
                  "Rachas diarias o metas semanales flexibles.",
                  "Historial completo para mirar tu proceso con perspectiva.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-bold text-ink-soft">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E8EFCF] text-[#5E7131]">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  day: "L",
                  date: "19",
                  active: true,
                  score: 3,
                },
                { day: "M", date: "20", active: true, score: 4 },
                { day: "X", date: "21", active: true, score: 3 },
                { day: "J", date: "22", active: false, score: 0 },
                { day: "V", date: "23", active: false, score: 0 },
                { day: "S", date: "24", active: false, score: 0 },
                { day: "D", date: "25", active: false, score: 0 },
              ].slice(0, 6).map((day) => (
                <div
                  key={day.date}
                  className={`flex items-center gap-3 rounded-2xl border p-3 ${
                    day.active
                      ? "border-[#E5CE8F] bg-white"
                      : "border-[#EFE6D1] bg-white/45"
                  }`}
                >
                  <span
                    className={`flex size-11 flex-col items-center justify-center rounded-xl ${
                      day.active ? "bg-[#FFE8A8] text-[#7D5A0E]" : "bg-cream-200 text-ink-faint"
                    }`}
                  >
                    <span className="text-[0.55rem] font-black uppercase">{day.day}</span>
                    <span className="text-sm font-black leading-none">{day.date}</span>
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-ink">
                      {day.active ? `${day.score} de 4 hábitos` : "Por venir"}
                    </p>
                    <p className="mt-0.5 text-[0.62rem] font-bold text-ink-muted">
                      {day.active ? "Día con intención" : "Sin presión"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="comunidad" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-[#EBD8A8] bg-[#3E3521] p-6 text-cream-100 shadow-lift sm:p-9">
                <div className="absolute -right-20 -top-20 size-64 rounded-full bg-[#F2C14E]/15 blur-3xl" />
                <div className="relative flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#FFE8A8]">
                    <Trophy className="size-3.5" />
                    Reto activo
                  </span>
                  <span className="text-[0.65rem] font-bold text-cream-300/70">
                    Quedan 11 días
                  </span>
                </div>
                <h3 className="relative mt-5 text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                  21 días de gratitud
                </h3>
                <p className="relative mt-2 max-w-md text-sm font-semibold leading-relaxed text-cream-300/75">
                  Un pequeño gesto al día. Comparte lo que descubres y celebra
                  el avance de los demás.
                </p>

                <div className="relative mt-7 rounded-3xl bg-white/10 p-5 backdrop-blur">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#FFE8A8]/80">
                        Mi progreso
                      </p>
                      <p className="mt-1 text-4xl font-black tracking-[-0.05em] text-white">
                        14<span className="text-lg text-cream-300/60"> / 21</span>
                      </p>
                    </div>
                    <span className="rounded-full bg-[#F2C14E] px-3 py-1 text-[0.68rem] font-black text-[#3E3521]">
                      67%
                    </span>
                  </div>
                  <div className="mt-4 h-2.5 rounded-full bg-white/15">
                    <div className="h-full w-2/3 rounded-full bg-[#F2C14E]" />
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {["LM", "AR", "JP", "SC"].map((initials, index) => (
                        <span
                          key={initials}
                          className={`flex size-8 items-center justify-center rounded-full border-2 border-[#4A402A] text-[0.55rem] font-black ${
                            ["bg-[#FFE8A8] text-[#6E500D]", "bg-[#E8EFCF] text-[#4E672A]", "bg-[#F7E4CB] text-[#84552A]", "bg-[#E7F1F2] text-[#416B73]"][index]
                          }`}
                        >
                          {initials}
                        </span>
                      ))}
                    </div>
                    <span className="text-[0.65rem] font-bold text-cream-300/70">
                      12 personas avanzando
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:pl-8">
              <p className="eyebrow">Mejor juntos</p>
              <h2 className="mt-3 text-balance text-[2.5rem] font-black leading-[1.05] tracking-[-0.05em] text-ink sm:text-5xl">
                Comparte el reto.
                <br />
                No tus datos.
              </h2>
              <p className="mt-4 text-lg font-semibold leading-relaxed text-ink-soft">
                Tus hábitos y tu historial son privados. En comunidad solo
                compartes el avance que tú decides: los retos a los que te unes,
                tu progreso y el de las personas que caminan contigo.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  {
                    icon: Target,
                    title: "Retos con intención",
                    copy: "Crea un reto, define una meta y suma tu avance día a día.",
                  },
                  {
                    icon: Users,
                    title: "Progreso visible",
                    copy: "Mira cómo avanzan los participantes y celebra sus logros.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Privacidad primero",
                    copy: "Ni correos ni hábitos personales se exponen en lo social.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cream-300 text-[#8A6512]">
                      <item.icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-extrabold text-ink">{item.title}</h3>
                      <p className="mt-0.5 text-sm font-semibold leading-relaxed text-ink-muted">
                        {item.copy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="open-source" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-[#EBD8A8] bg-cream-200 px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
            <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 opacity-15 lg:block">
              <LogoMark size={280} />
            </div>
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#DCC485] bg-white/55 px-3.5 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#8A6512]">
                <Github className="size-3.5" />
                Código abierto · MIT
              </span>
              <h2 className="mt-5 text-balance text-[2.5rem] font-black leading-[1.02] tracking-[-0.055em] text-ink sm:text-5xl">
                Un proyecto para cuidar, compartir y hacer tuyo.
              </h2>
              <p className="mt-4 max-w-xl text-base font-semibold leading-relaxed text-ink-soft">
                Habitactive está construido con Next.js, TypeScript, Prisma y
                Tailwind. Sin cajas negras: clona el repositorio, adáptalo a tu
                comunidad y despliégalo donde quieras.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="btn-dark px-6 py-3 text-base">
                  Empieza con tu cuenta
                  <ArrowRight className="size-4" />
                </Link>
                <Link href="/login" className="btn-ghost px-6 py-3 text-base">
                  Ya tengo cuenta
                </Link>
              </div>
              <p className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-ink-muted">
                <Heart className="size-3.5 text-[#B88916]" />
                Hecho con cuidado para personas que quieren crecer.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#F0E3C3] bg-cream-100/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo markSize={36} />
            <p className="mt-3 max-w-xs text-xs font-semibold leading-relaxed text-ink-muted">
              Pequeños hábitos. Grandes comunidades. Una PWA open source para
              crecer con intención.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold text-ink-muted">
            <Link href="#como-funciona" className="hover:text-ink">Cómo funciona</Link>
            <Link href="#comunidad" className="hover:text-ink">Comunidad</Link>
            <Link href="#open-source" className="hover:text-ink">Open source</Link>
            <Link href="/login" className="hover:text-ink">Iniciar sesión</Link>
            <Link href="/privacy" className="hover:text-ink">Privacidad</Link>
            <Link href="/terms" className="hover:text-ink">Términos</Link>
          </div>
        </div>
        <div className="border-t border-[#F0E3C3]/80">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-[0.65rem] font-semibold text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>© {new Date().getFullYear()} Habitactive · Licencia MIT.</p>
            <p>Privado por diseño. Sin anuncios. Sin atajos.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
