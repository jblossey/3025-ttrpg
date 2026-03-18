import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, username } from "better-auth/plugins";
import * as schema from "../db/schema";
import { db } from "./db";

const appUrl = new URL(process.env.BETTER_AUTH_URL ?? "");

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    username(),
    passkey({
      rpID: appUrl.hostname,
      origin: appUrl.origin,
    }),
    admin(),
    nextCookies(),
  ],
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
});
