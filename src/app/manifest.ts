import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Habitactive · Hábitos y retos en comunidad",
    short_name: "Habitactive",
    description:
      "Construye hábitos que duran, mide tus rachas y avanza junto a tu comunidad.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#FFFDF5",
    theme_color: "#FFF8E6",
    lang: "es",
    dir: "ltr",
    categories: ["health", "lifestyle", "productivity"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Mis hábitos",
        short_name: "Hoy",
        url: "/dashboard",
        description: "Marca tus hábitos del día",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Comunidad",
        short_name: "Retos",
        url: "/community",
        description: "Descubre retos y avanza con otros",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
