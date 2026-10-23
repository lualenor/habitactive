import { CloudOff, Home } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-10 text-center">
      <Logo markSize={56} />
      <span className="mt-10 flex size-16 items-center justify-center rounded-3xl bg-cream-300 text-[#8A6512]">
        <CloudOff className="size-7" />
      </span>
      <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] text-ink">
        Estás sin conexión
      </h1>
      <p className="mt-2 max-w-sm text-sm font-semibold leading-relaxed text-ink-muted">
        Tu intención sigue aquí. Cuando recuperes la conexión, podrás marcar tus
        hábitos y ver tus rachas actualizadas.
      </p>
      <Link href="/dashboard" className="btn-primary mt-6">
        <Home className="size-4" />
        Reintentar
      </Link>
    </div>
  );
}
