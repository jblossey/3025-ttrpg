import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StatsSection } from "./stats-section";

describe("StatsSection", () => {
  it("renders all three stat labels", () => {
    const onStatsChange = vi.fn();
    const stats = { body: 0, intelligence: 1, charisma: -1 };

    render(<StatsSection stats={stats} onStatsChange={onStatsChange} />);

    expect(screen.getByText("Body")).toBeDefined();
    expect(screen.getByText("Intelligence")).toBeDefined();
    expect(screen.getByText("Charisma")).toBeDefined();
  });

  it("renders stat codes", () => {
    const onStatsChange = vi.fn();
    const stats = { body: 0, intelligence: 0, charisma: 0 };

    render(<StatsSection stats={stats} onStatsChange={onStatsChange} />);

    expect(screen.getByText("[BOD]")).toBeDefined();
    expect(screen.getByText("[INT]")).toBeDefined();
    expect(screen.getByText("[CHA]")).toBeDefined();
  });

  it("renders section title", () => {
    const onStatsChange = vi.fn();
    const stats = { body: 0, intelligence: 0, charisma: 0 };

    render(<StatsSection stats={stats} onStatsChange={onStatsChange} />);

    expect(screen.getByText(/Core Attributes/)).toBeDefined();
  });
});
