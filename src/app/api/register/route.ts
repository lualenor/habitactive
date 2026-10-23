import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { fieldErrors, registerSchema } from "@/lib/validations";

export const runtime = "nodejs";

function ipFromRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  const ip = ipFromRequest(request);
  const limiter = rateLimit(`register:${ip}`, 5, 10 * 60 * 1000);

  if (!limiter.allowed) {
    return NextResponse.json(
      {
        message:
          "Demasiados intentos de registro. Espera unos minutos e inténtalo de nuevo.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limiter.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "La solicitud no es válida." },
      { status: 400 },
    );
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Revisa los datos del formulario.",
        errors: fieldErrors(parsed.error),
      },
      { status: 422 },
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: await hashPassword(parsed.data.password),
        timeZone: parsed.data.timeZone || "America/Bogota",
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(
      {
        message: "Tu cuenta está lista.",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          message: "Ya existe una cuenta con este correo.",
          errors: { email: ["Este correo ya está registrado."] },
        },
        { status: 409 },
      );
    }

    console.error("Error creando usuario", error);
    return NextResponse.json(
      { message: "No pudimos crear tu cuenta. Inténtalo de nuevo." },
      { status: 500 },
    );
  }
}
