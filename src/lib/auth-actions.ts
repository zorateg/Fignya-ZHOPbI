"use server";

import { cookies } from "next/headers";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  createSession,
  deleteSession,
  getCurrentUser,
  hashPassword,
  verifyPassword,
} from "./auth";

const SESSION_COOKIE = "session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

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
  "use server";
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
  "use server";
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
  "use server";
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await deleteSession(token);
  await clearSessionCookie();
  return { redirect: "/login" };
}

export async function changePassword(
  _prevState: { error?: string } | null,
  formData: FormData,
) {
  "use server";
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
