import { describe, expect, it } from "vitest";

import {
  passwordSchema,
  usernameSchema,
  validatePassword,
  validateUsername,
} from "./validation";

describe("validateUsername", () => {
  it("accepts valid snake_case username", () => {
    expect(validateUsername("john_doe")).toEqual({ success: true });
  });

  it("accepts username without underscores", () => {
    expect(validateUsername("johndoe")).toEqual({ success: true });
  });

  it("accepts minimum length (3 chars)", () => {
    expect(validateUsername("abc")).toEqual({ success: true });
  });

  it("rejects username shorter than 3 chars", () => {
    const result = validateUsername("ab");
    expect(result.success).toBe(false);
  });

  it("rejects username longer than 30 chars", () => {
    const result = validateUsername("a".repeat(31));
    expect(result.success).toBe(false);
  });

  it("rejects uppercase letters", () => {
    const result = validateUsername("JohnDoe");
    expect(result.success).toBe(false);
  });

  it("rejects starting with a number", () => {
    const result = validateUsername("1user");
    expect(result.success).toBe(false);
  });

  it("rejects consecutive underscores", () => {
    const result = validateUsername("john__doe");
    expect(result.success).toBe(false);
  });

  it("rejects trailing underscore", () => {
    const result = validateUsername("john_");
    expect(result.success).toBe(false);
  });
});

describe("validatePassword", () => {
  it("accepts valid complex password", () => {
    expect(validatePassword("MyP@ssw0rd123")).toEqual({ success: true });
  });

  it("rejects password shorter than 12 chars", () => {
    const result = validatePassword("MyP@ss0rd1!");
    expect(result.success).toBe(false);
  });

  it("rejects password without lowercase", () => {
    const result = validatePassword("MYPASSWORD1!");
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const result = validatePassword("mypassword1!");
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const result = validatePassword("MyPassword!!");
    expect(result.success).toBe(false);
  });

  it("rejects password without special char", () => {
    const result = validatePassword("MyPassword123");
    expect(result.success).toBe(false);
  });
});

describe("usernameSchema", () => {
  it("parses valid username", () => {
    expect(usernameSchema.parse("valid_user")).toBe("valid_user");
  });

  it("throws on invalid username", () => {
    expect(() => usernameSchema.parse("INVALID")).toThrow();
  });
});

describe("passwordSchema", () => {
  it("parses valid password", () => {
    expect(passwordSchema.parse("ValidP@ss123")).toBe("ValidP@ss123");
  });

  it("throws on weak password", () => {
    expect(() => passwordSchema.parse("weak")).toThrow();
  });
});
