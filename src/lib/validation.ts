import { z } from "zod";

const USERNAME_REGEX = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    USERNAME_REGEX,
    "Username must be lowercase snake_case (letters, numbers, underscores)",
  );

export const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .refine((v) => /[a-z]/.test(v), "Password must include a lowercase letter")
  .refine((v) => /[A-Z]/.test(v), "Password must include an uppercase letter")
  .refine((v) => /[0-9]/.test(v), "Password must include a number")
  .refine(
    (v) => /[^a-zA-Z0-9]/.test(v),
    "Password must include a special character",
  );

export function validateUsername(value: string) {
  const result = usernameSchema.safeParse(value);
  if (result.success) return { success: true as const };
  return { success: false as const, error: result.error.issues[0].message };
}

export function validatePassword(value: string) {
  const result = passwordSchema.safeParse(value);
  if (result.success) return { success: true as const };
  return { success: false as const, error: result.error.issues[0].message };
}
