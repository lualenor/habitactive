import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function percentage(value: number, total: number) {
  if (total <= 0) return 0;
  return clamp(Math.round((value / total) * 100), 0, 100);
}

export function pluralize(
  value: number,
  singular: string,
  plural = `${singular}s`,
) {
  return `${value} ${value === 1 ? singular : plural}`;
}
