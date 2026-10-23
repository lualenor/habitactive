"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-5 py-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-3xl bg-[#FCEBDD] text-[#A35832]">
        <AlertTriangle className="size-6" />
      </span>
      <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] text-ink">
        Algo no salió como esperábamos
      </h1>
      <p className="mt-2 max-w-sm text-sm font-semibold leading-relaxed text-ink-muted">
        Tu información está a salvo. Puedes intentarlo de nuevo o volver a tu
        día.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={reset} className="btn-primary">
          <RotateCcw className="size-4" />
          Intentar de nuevo
        </button>
        <Link href="/dashboard" className="btn-ghost">
          Ir a mi día
        </Link>
      </div>
      {error.digest && (
        <p className="mt-5 text-[0.6rem] font-semibold text-ink-faint">
          Referencia: {error.digest}
        </p>
      )}
    </div>
  );
}
