"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { login } from "@/lib/auth-actions";
import { useToast } from "@/components/ui/toast";

interface LoginFormProps {
  seedEmail: string | null;
}

export default function LoginForm({ seedEmail }: LoginFormProps) {
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await login(null, formData);
    if (result.error) {
      setError(result.error);
      toast({
        title: "Ошибка входа",
        description: result.error,
        variant: "destructive",
      });
    } else {
      router.replace("/dashboard");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-zinc-300">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={seedEmail ?? ""}
          placeholder="zhora@fignya.ru"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-zinc-300">
          Пароль
        </label>
        <Input id="password" name="password" type="password" required />
      </div>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <Button type="submit" className="w-full">Войти</Button>
    </form>
  );
}
