import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username, admin } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";
import * as schema from "../db/auth-schema";

const appUrl = new URL(process.env.BETTER_AUTH_URL!);

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
