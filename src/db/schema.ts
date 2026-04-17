import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import type { CharacterData } from "@/types/character";

// Re-export everything from auth schema so drizzle-kit sees all tables
export * from "./auth-schema";

// Import user table for FK reference and relations
import { user } from "./auth-schema";

export const character = pgTable(
  "character",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull().default(""),
    data: jsonb("data").$type<CharacterData>().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("character_userId_idx").on(table.userId),
    uniqueIndex("character_userId_unique").on(table.userId),
  ],
);

export const characterRelations = relations(character, ({ one }) => ({
  user: one(user, {
    fields: [character.userId],
    references: [user.id],
  }),
}));
