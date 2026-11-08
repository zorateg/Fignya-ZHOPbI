import * as crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";

const SESSION_COOKIE = "session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(
      password,
      salt,
      64,
      (err: NodeJS.ErrnoException | null, derivedKey: Buffer) => {
        if (err) return reject(err);
        resolve(`scrypt:${salt}:${derivedKey.toString("hex")}`);
      },
    );
  });
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [algo, salt, key] = stored.split(":");
  if (algo !== "scrypt" || !salt || !key) return false;
  return new Promise((resolve, reject) => {
    crypto.scrypt(
      password,
      salt,
      64,
      (err: NodeJS.ErrnoException | null, derivedKey: Buffer) => {
        if (err) return reject(err);
        resolve(derivedKey.toString("hex") === key);
      },
    );
  });
}

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: number): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.insert(sessions).values({
    id: token,
    userId,
    expiresAt,
  });
  return token;
}

export async function validateSession(token?: string | null) {
  if (!token) return null;

  const now = new Date();
  const result = await db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, token), gt(sessions.expiresAt, now)));

  const row = result[0];
  if (!row) return null;

  const { session, user } = row;
  const { passwordHash, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, session };
}

export async function deleteSession(token: string) {
  await db.delete(sessions).where(eq(sessions.id, token));
}

async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}

export async function login(
  _prevState: { error?: string } | null,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Введите email и пароль" };
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = existing[0];
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Неверный email или пароль" };
  }

  const token = await createSession(user.id);
  await setSessionCookie(token);

  return { error: null, redirect: "/dashboard" };
}

export async function register(
  _prevState: { error?: string } | null,
  formData: FormData,
) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "Заполните все поля" };
  }
  if (password.length < 6) {
    return { error: "Пароль должен содержать минимум 6 символов" };
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing[0]) {
    return { error: "Пользователь с таким email уже существует" };
  }

  const passwordHash = await hashPassword(password);
  const created = await db
    .insert(users)
    .values({ name, email, passwordHash })
    .returning({ id: users.id });

  const token = await createSession(created[0].id);
  await setSessionCookie(token);

  return { error: null, redirect: "/dashboard" };
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await deleteSession(token);
  await clearSessionCookie();
  return { redirect: "/login" };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await validateSession(token);
  return session?.user ?? null;
}

export async function changePassword(
  _prevState: { error?: string } | null,
  formData: FormData,
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Требуется вход в систему" };

  const oldPassword = String(formData.get("oldPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (!oldPassword || !newPassword) {
    return { error: "Заполните оба поля" };
  }
  if (newPassword.length < 6) {
    return { error: "Новый пароль должен содержать минимум 6 символов" };
  }

  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!(await verifyPassword(oldPassword, dbUser[0].passwordHash))) {
    return { error: "Старый пароль неверен" };
  }

  const passwordHash = await hashPassword(newPassword);
  await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));

  return { error: null };
}
