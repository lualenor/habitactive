"use client";

import { X } from "lucide-react";
import {
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  footer,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      firstFocusable?.focus();
    }, 30);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#2D2718]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-[#F0E2B6] bg-cream-100 shadow-lift animate-soft-pop sm:max-w-xl sm:rounded-[2rem]",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#F0E5C9] px-5 py-5 sm:px-7">
          <div>
            <h2 id={titleId} className="text-2xl font-black text-ink">
              {title}
            </h2>
            {description && (
              <p
                id={descriptionId}
                className="mt-1 max-w-md text-sm font-semibold text-ink-muted"
              >
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-button -mr-1 -mt-1 size-9 shrink-0"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {children}
        </div>

        {footer && (
          <div className="border-t border-[#F0E5C9] bg-cream-200/40 px-5 py-4 sm:px-7">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
