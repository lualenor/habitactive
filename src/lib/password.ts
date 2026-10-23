import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

/** Hash de relleno para igualar tiempos cuando el correo no existe. */
export const DUMMY_PASSWORD_HASH =
  "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxqO4bYq0WjYpV5R8B9dQm3lq0S";
