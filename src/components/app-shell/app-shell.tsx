import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { HabitDialog } from "@/components/habits/habit-dialog";
import {
  BottomNav,
  SidebarNav,
  SignOutButton,
} from "@/components/app-shell/nav";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ShellUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export function AppShell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17rem] flex-col border-r border-[#EFE2C5] bg-[#FFFDF7]/85 px-4 py-5 backdrop-blur-xl lg:flex">
        <div className="px-2">
          <Logo markSize={42} />
        </div>

        <div className="mt-7 px-2">
          <HabitDialog
            triggerLabel="Nuevo hábito"
            triggerClassName="w-full"
          />
        </div>

        <div className="mt-7 flex-1">
          <p className="mb-2 px-4 text-[0.6rem] font-black uppercase tracking-[0.18em] text-ink-faint">
            Tu espacio
          </p>
          <SidebarNav />
        </div>

        <div className="rounded-[1.5rem] border border-[#EFE2C5] bg-cream-200/55 p-4">
          <p className="text-[0.58rem] font-black uppercase tracking-[0.16em] text-[#9A7B2D]">
            Una idea para hoy
          </p>
          <p className="mt-1.5 text-xs font-semibold leading-relaxed text-ink-soft">
            No necesitas una racha perfecta. Necesitas volver mañana.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl px-2 py-2">
          <Link
            href="/settings"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl"
          >
            <Avatar name={user.name} image={user.image} size="sm" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold text-ink">
                {user.name}
              </span>
              <span className="block truncate text-[0.65rem] font-semibold text-ink-muted">
                {user.email}
              </span>
            </span>
          </Link>
          <SignOutButton />
        </div>
      </aside>

      <div className="lg:pl-[17rem]">
        <MobileTopBar userName={user.name} image={user.image} />

        <main
          id="contenido"
          className="mx-auto w-full max-w-[84rem] px-4 pb-28 pt-5 sm:px-7 lg:px-10 lg:pb-12 lg:pt-9"
        >
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

function MobileTopBar({
  userName,
  image,
}: {
  userName: string;
  image: string | null;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#EFE2C5]/80 bg-[#FFFDF5]/90 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex h-[4.25rem] max-w-2xl items-center justify-between px-4 sm:px-6">
        <Logo markSize={36} />
        <div className="flex items-center gap-2">
          <span className="hidden text-[0.68rem] font-bold text-ink-muted sm:block">
            {userName.split(" ")[0]}
          </span>
          <Link
            href="/settings"
            className={cn("rounded-full ring-offset-2 ring-offset-[#FFFDF5]")}
            aria-label="Ir a ajustes de perfil"
          >
            <Avatar name={userName} image={image} size="sm" />
          </Link>
        </div>
      </div>
    </header>
  );
}
