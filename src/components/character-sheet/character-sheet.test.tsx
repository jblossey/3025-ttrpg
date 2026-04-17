import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createDefaultCharacterData } from "@/types/character";

import { CharacterSheet } from "./character-sheet";

// Mock next/link to render a plain anchor
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock the auto-save hook (calls server actions internally)
vi.mock("@/hooks/use-auto-save", () => ({
  useAutoSave: () => "idle",
}));

describe("CharacterSheet", () => {
  it("renders without crashing", () => {
    const data = createDefaultCharacterData();
    data.name = "Test Pilot";

    render(<CharacterSheet characterId="test-id" initialData={data} />);

    expect(screen.getByText("Test Pilot")).toBeDefined();
  });

  it("displays HP and stress gauges", () => {
    const data = createDefaultCharacterData();
    render(<CharacterSheet characterId="test-id" initialData={data} />);

    expect(screen.getByText("HP")).toBeDefined();
    expect(screen.getByText("STR")).toBeDefined();
  });

  it("renders all section titles", () => {
    const data = createDefaultCharacterData();
    render(<CharacterSheet characterId="test-id" initialData={data} />);

    expect(screen.getByText(/Identity/)).toBeDefined();
    expect(screen.getByText(/Core Attributes/)).toBeDefined();
  });
});
