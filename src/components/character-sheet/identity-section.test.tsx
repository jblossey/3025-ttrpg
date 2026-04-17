import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IdentitySection } from "./identity-section";

describe("IdentitySection", () => {
  it("renders with a name", () => {
    const onNameChange = vi.fn();
    render(<IdentitySection name="Test Pilot" onNameChange={onNameChange} />);

    const input = screen.getByPlaceholderText("ENTER CHARACTER NAME");
    expect(input).toBeDefined();
    expect((input as HTMLInputElement).value).toBe("Test Pilot");
  });

  it("renders with empty name", () => {
    const onNameChange = vi.fn();
    render(<IdentitySection name="" onNameChange={onNameChange} />);

    expect(screen.getByText(/Identity/)).toBeDefined();
  });
});
