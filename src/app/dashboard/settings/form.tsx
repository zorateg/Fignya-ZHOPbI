"use client";

import { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { changePassword } from "@/lib/auth-actions";
import { useToast } from "@/components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChangePasswordForm() {
  const [error, setError] = useState("");
  const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    const result = await changePassword(null, formData);
    if (result.error) {
      setError(result.error);
    } else {
      setError("");
      toast({ title: "Пароль изменён", description: "Новый пароль в силе" });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Смена пароля</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-300">{error}</p>}
          <div className="space-y-2">
            <label htmlFor="oldPassword" className="text-sm font-medium text-zinc-300">
              Текущий пароль
            </label>
            <Input id="oldPassword" name="oldPassword" type="password" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-zinc-300">
              Новый пароль
            </label>
            <Input id="newPassword" name="newPassword" type="password" minLength={6} required />
          </div>
          <Button type="submit">Сменить пароль</Button>
        </form>
      </CardContent>
    </Card>
  );
}
