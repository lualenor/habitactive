"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "@/components/ui/button";

export function SubmitButton({
  children,
  pendingText = "Guardando…",
  ...props
}: ButtonProps & { pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || props.disabled} {...props}>
      {pending && <LoaderCircle className="size-4 animate-spin" />}
      {pending ? pendingText : children}
    </Button>
  );
}
