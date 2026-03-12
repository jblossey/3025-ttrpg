export const ROLES = {
  USER: "user",
  GAMEMASTER: "gamemaster",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function isPrivilegedRole(role: string | null | undefined): boolean {
  return role === ROLES.ADMIN || role === ROLES.GAMEMASTER;
}
