import { db } from "@/db";
import { nonsenseItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import EditForm from "./form";

export default async function NonsenseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const itemId = Number(id);
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const item = await db
    .select()
    .from(nonsenseItems)
    .where(eq(nonsenseItems.id, itemId))
    .limit(1);

  if (!item[0]) redirect("/dashboard/nonsense");
  if (item[0].authorId !== user.id && user.role !== "admin") {
    redirect("/dashboard/nonsense");
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-2">
        <Link href={`/dashboard/nonsense/${itemId}`}>
          <Button variant="outline" size="sm">
            ← Назад к записи
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Редактировать фигню</CardTitle>
          <CardDescription>
            Внесите изменения. Жора заметит каждую деталь.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditForm item={item[0]} />
        </CardContent>
      </Card>
    </div>
  );
}
