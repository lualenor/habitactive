import type { Metadata, Viewport } from "next";
import "@fontsource-variable/nunito";
import "./globals.css";

import { Toaster } from "sonner";

import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";

const appUrl =
  process.env.NEXTAUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Habitactive · Hábitos que crecen en comunidad",
    template: "%s · Habitactive",
  },
  description:
    "Construye hábitos que duran, mide tus rachas y avanza junto a tu comunidad. PWA open source, privada por diseño.",
  applicationName: "Habitactive",
  authors: [{ name: "Comunidad Habitactive" }],
  creator: "Habitactive",
  keywords: [
    "hábitos",
    "habit tracker",
    "retos",
    "comunidad",
    "PWA",
    "open source",
    "rachas",
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  appleWebApp: {
    capable: true,
    title: "Habitactive",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: appUrl,
    siteName: "Habitactive",
    title: "Habitactive · Hábitos que crecen en comunidad",
    description:
      "Pequeños hábitos, grandes comunidades. Rachas, retos y progreso compartido sin perder tu privacidad.",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "Habitactive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Habitactive · Hábitos que crecen en comunidad",
    description:
      "Pequeños hábitos, grandes comunidades. Una PWA open source para crecer juntos.",
    images: ["/brand/og-image.png"],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFF8E6",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="font-sans app-background">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
        >
          Saltar al contenido
        </a>
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            style: {
              borderRadius: "18px",
              border: "1px solid #F0E2B6",
              background: "#FFFDF5",
              color: "#2D2718",
              fontWeight: 700,
            },
          }}
        />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
