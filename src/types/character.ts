import { z } from "zod";

// ── Zod Schemas ──────────────────────────────────────────────────────────────

const skillNodeSchema: z.ZodType<SkillNodeData> = z.object({
  id: z.string(),
  name: z.string(),
  proficiency: z.number().int().min(0).max(5),
  children: z.lazy(() => z.array(skillNodeSchema)),
});

export const characterDataSchema = z.object({
  name: z.string(),
  stats: z.object({
    body: z.number().int().min(-1).max(2),
    intelligence: z.number().int().min(-1).max(2),
    charisma: z.number().int().min(-1).max(2),
  }),
  vitals: z.object({
    hp: z.object({
      current: z.number().int(),
    }),
    stress: z.object({
      current: z.number().int(),
    }),
  }),
  psychology: z.object({
    unbreakableConviction: z.string().max(500),
    flexibleConviction: z.string().max(500),
    fearDoubt: z.string().max(500),
  }),
  history: z.object({
    profession: z.string(),
    professionDetails: z.string(),
    mannerisms: z.string(),
  }),
  connections: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      relationship: z.string(),
    }),
  ),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      quantity: z.number().int().min(1),
    }),
  ),
  skillTrees: z.array(
    z.object({
      id: z.string(),
      rootSkill: skillNodeSchema,
    }),
  ),
});

// ── TypeScript Types (inferred from Zod) ─────────────────────────────────────

export interface SkillNodeData {
  id: string;
  name: string;
  proficiency: number;
  children: SkillNodeData[];
}

export type CharacterData = z.infer<typeof characterDataSchema>;

// ── Derived Values ───────────────────────────────────────────────────────────

export function computeMaxHp(body: number): number {
  return 12 + 3 * body;
}

export function computeMaxStress(charisma: number): number {
  return 12 + 3 * charisma;
}

// ── Default Data Factory ─────────────────────────────────────────────────────

export function createDefaultCharacterData(): CharacterData {
  return {
    name: "",
    stats: {
      body: 0,
      intelligence: 0,
      charisma: 0,
    },
    vitals: {
      hp: { current: 12 },
      stress: { current: 0 },
    },
    psychology: {
      unbreakableConviction: "",
      flexibleConviction: "",
      fearDoubt: "",
    },
    history: {
      profession: "",
      professionDetails: "",
      mannerisms: "",
    },
    connections: [],
    items: [],
    skillTrees: [],
  };
}
