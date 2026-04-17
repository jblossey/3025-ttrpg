import { describe, expect, it } from "vitest";

import {
  characterDataSchema,
  computeMaxHp,
  computeMaxStress,
  createDefaultCharacterData,
} from "./character";

describe("computeMaxHp", () => {
  it.each([
    { body: -1, expected: 9 },
    { body: 0, expected: 12 },
    { body: 1, expected: 15 },
    { body: 2, expected: 18 },
  ])("returns $expected when body is $body", ({ body, expected }) => {
    expect(computeMaxHp(body)).toBe(expected);
  });
});

describe("computeMaxStress", () => {
  it.each([
    { charisma: -1, expected: 9 },
    { charisma: 0, expected: 12 },
    { charisma: 1, expected: 15 },
    { charisma: 2, expected: 18 },
  ])(
    "returns $expected when charisma is $charisma",
    ({ charisma, expected }) => {
      expect(computeMaxStress(charisma)).toBe(expected);
    },
  );
});

describe("createDefaultCharacterData", () => {
  it("returns valid character data", () => {
    const data = createDefaultCharacterData();
    expect(() => characterDataSchema.parse(data)).not.toThrow();
  });

  it("has zeroed stats", () => {
    const data = createDefaultCharacterData();
    expect(data.stats).toEqual({ body: 0, intelligence: 0, charisma: 0 });
  });

  it("has default hp matching body=0", () => {
    const data = createDefaultCharacterData();
    expect(data.vitals.hp.current).toBe(computeMaxHp(0));
  });

  it("has empty collections", () => {
    const data = createDefaultCharacterData();
    expect(data.connections).toHaveLength(0);
    expect(data.items).toHaveLength(0);
    expect(data.skillTrees).toHaveLength(0);
  });
});

describe("characterDataSchema", () => {
  it("accepts valid data", () => {
    const data = createDefaultCharacterData();
    const result = characterDataSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("rejects stats out of range", () => {
    const data = createDefaultCharacterData();
    data.stats.body = 5;
    const result = characterDataSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects negative stat below minimum", () => {
    const data = createDefaultCharacterData();
    data.stats.intelligence = -2;
    const result = characterDataSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects item with quantity less than 1", () => {
    const data = createDefaultCharacterData();
    data.items = [{ id: "1", name: "Sword", quantity: 0 }];
    const result = characterDataSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects psychology text exceeding 500 chars", () => {
    const data = createDefaultCharacterData();
    data.psychology.unbreakableConviction = "a".repeat(501);
    const result = characterDataSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("accepts skill tree with nested children", () => {
    const data = createDefaultCharacterData();
    data.skillTrees = [
      {
        id: "tree-1",
        rootSkill: {
          id: "s1",
          name: "Piloting",
          proficiency: 3,
          children: [
            {
              id: "s2",
              name: "Evasive Maneuvers",
              proficiency: 1,
              children: [],
            },
          ],
        },
      },
    ];
    const result = characterDataSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("rejects proficiency above 5", () => {
    const data = createDefaultCharacterData();
    data.skillTrees = [
      {
        id: "tree-1",
        rootSkill: {
          id: "s1",
          name: "Piloting",
          proficiency: 6,
          children: [],
        },
      },
    ];
    const result = characterDataSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
