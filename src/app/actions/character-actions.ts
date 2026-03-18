"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { character, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isPrivilegedRole } from "@/lib/roles";
import {
  type CharacterData,
  characterDataSchema,
  createDefaultCharacterData,
} from "@/types/character";

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) throw new Error("Unauthorized");
  return session;
}

// ── Get or create the current user's character ───────────────────────────────

export async function getOrCreateCharacter() {
  const session = await getSession();

  const defaultData = createDefaultCharacterData();

  // Upsert: insert if no character exists for this user, otherwise do nothing.
  // The unique index on user_id prevents duplicates under concurrency.
  await db
    .insert(character)
    .values({
      userId: session.user.id,
      name: defaultData.name,
      data: defaultData,
    })
    .onConflictDoNothing({ target: character.userId });

  // Always re-select to get the canonical row (whether just inserted or already existed)
  const [result] = await db
    .select()
    .from(character)
    .where(eq(character.userId, session.user.id))
    .limit(1);

  return result;
}

// ── Get a character by ID (with ownership/role check) ────────────────────────

export async function getCharacter(characterId: string) {
  const session = await getSession();

  const [result] = await db
    .select()
    .from(character)
    .where(eq(character.id, characterId))
    .limit(1);

  if (!result) return null;

  if (
    result.userId !== session.user.id &&
    !isPrivilegedRole(session.user.role)
  ) {
    throw new Error("Forbidden");
  }

  return result;
}

// ── Update a character ───────────────────────────────────────────────────────

export async function updateCharacter(
  characterId: string,
  data: CharacterData,
) {
  const session = await getSession();

  // Validate input
  const parsed = characterDataSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid character data" };
  }

  // Check ownership
  const [existing] = await db
    .select({ userId: character.userId })
    .from(character)
    .where(eq(character.id, characterId))
    .limit(1);

  if (!existing) return { error: "Character not found" };

  if (
    existing.userId !== session.user.id &&
    !isPrivilegedRole(session.user.role)
  ) {
    return { error: "Forbidden" };
  }

  await db
    .update(character)
    .set({
      name: parsed.data.name,
      data: parsed.data,
    })
    .where(eq(character.id, characterId));

  return { success: true };
}

// ── Delete a character ───────────────────────────────────────────────────────

export async function deleteCharacter(characterId: string) {
  const session = await getSession();

  const [existing] = await db
    .select({ userId: character.userId })
    .from(character)
    .where(eq(character.id, characterId))
    .limit(1);

  if (!existing) return { error: "Character not found" };

  if (
    existing.userId !== session.user.id &&
    !isPrivilegedRole(session.user.role)
  ) {
    return { error: "Forbidden" };
  }

  await db.delete(character).where(eq(character.id, characterId));
  return { success: true };
}

// ── Get all characters (for GM/admin navigation) ─────────────────────────────

export async function getAllCharacters() {
  const session = await getSession();

  if (!isPrivilegedRole(session.user.role)) {
    throw new Error("Forbidden");
  }

  const results = await db
    .select({
      id: character.id,
      name: character.name,
      userId: character.userId,
      ownerName: user.name,
    })
    .from(character)
    .innerJoin(user, eq(character.userId, user.id));

  return results;
}
