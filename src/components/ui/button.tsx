import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "dark" | "ghost" | "quiet" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  dark: "btn-dark",
  ghost: "btn-ghost",
  quiet: "btn-quiet",
  danger: "btn-danger",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(variants[variant], className)}
      {...props}
    />
  );
}
