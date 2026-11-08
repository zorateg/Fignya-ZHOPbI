import { getCurrentUser } from "@/lib/auth";
import { getNonsenseItems } from "@/lib/nonsense-server";
import type { NonsenseItem } from "@/lib/nonsense";
import { NonsenseList } from "@/components/nonsense/nonsense-list";

export default async function NonsensePage() {
  const user = await getCurrentUser();
  if (!user) {
    // Not expected thanks to dashboard layout guard, but kept safe.
    return null;
  }

  const items = (await getNonsenseItems()) as NonsenseItem[];

  return (
    <NonsenseList initialItems={items} viewerId={user.id} isAdmin={user.role === "admin"} />
  );
}
