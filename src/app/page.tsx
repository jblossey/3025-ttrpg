import { headers } from "next/headers";
import { CharacterSheet } from "@/components/character-sheet/character-sheet";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isAdmin = session?.user.role === "admin";

  return <CharacterSheet isAdmin={isAdmin} />;
}
