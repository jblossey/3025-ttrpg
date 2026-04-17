import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { getCharacter } from "@/app/actions/character-actions";
import { CharacterSheet } from "@/components/character-sheet/character-sheet";
import { auth } from "@/lib/auth";
import type { CharacterData } from "@/types/character";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const { id } = await params;
  const result = await getCharacter(id);

  if (!result) notFound();

  const isAdmin = session.user.role === "admin";

  return (
    <CharacterSheet
      characterId={result.id}
      initialData={result.data as CharacterData}
      isAdmin={isAdmin}
    />
  );
}
