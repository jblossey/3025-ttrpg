import { createAuthClient } from "better-auth/react";
import { usernameClient, adminClient } from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,
  plugins: [usernameClient(), passkeyClient(), adminClient()],
});
