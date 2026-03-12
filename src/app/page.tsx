import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getOrCreateCharacter } from "@/app/actions/character-actions";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const character = await getOrCreateCharacter();
  redirect(`/character/${character.id}`);
}
