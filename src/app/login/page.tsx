"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GlowContainer } from "@/components/thegridcn/glow-container";
import { HUDFrame } from "@/components/thegridcn/hud-frame";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.SubmitEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await authClient.signIn.username({
      username,
      password,
    });

    if (signInError) {
      setError(signInError.message ?? "Authentication failed");
      setLoading(false);
      return;
    }

    router.push("/");
  }

  async function handlePasskeySignIn() {
    setError("");
    setLoading(true);

    const { error: passkeyError } = await authClient.signIn.passkey();

    if (passkeyError) {
      setError(passkeyError.message ?? "Passkey authentication failed");
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <GlowContainer
        intensity="sm"
        hover={false}
        className="w-full max-w-md bg-transparent border-none p-0"
      >
        <HUDFrame label="System Access">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wider text-primary glow-text">
                3025
              </h1>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                IDENTITY VERIFICATION REQUIRED
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <TextInput
                label="Username"
                placeholder="Enter callsign"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
              <TextInput
                label="Password"
                type="password"
                placeholder="Enter passphrase"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              {error && (
                <p className="font-mono text-xs text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full glow-sm"
                size="lg"
              >
                {loading ? "Authenticating..." : "Authenticate"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/20" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handlePasskeySignIn}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              Sign in with Passkey
            </Button>
          </div>
        </HUDFrame>
      </GlowContainer>
    </div>
  );
}
