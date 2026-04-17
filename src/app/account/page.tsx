"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Divider } from "@/components/thegridcn/divider";
import { GlowContainer } from "@/components/thegridcn/glow-container";
import { HUDFrame } from "@/components/thegridcn/hud-frame";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { authClient } from "@/lib/auth-client";
import { validatePassword, validateUsername } from "@/lib/validation";

export default function AccountPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Username form state
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuccess, setUsernameSuccess] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Sign out state
  const [signingOut, setSigningOut] = useState(false);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground font-mono text-xs">Loading...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  async function handleChangeUsername(e: React.FormEvent) {
    e.preventDefault();
    setUsernameError("");
    setUsernameSuccess("");

    const validation = validateUsername(newUsername);
    if (!validation.success) {
      setUsernameError(validation.error);
      return;
    }

    setUsernameLoading(true);
    const { error } = await authClient.updateUser({
      username: newUsername,
      displayUsername: newUsername,
    });
    setUsernameLoading(false);

    if (error) {
      setUsernameError(error.message ?? "Failed to update username");
      return;
    }

    setUsernameSuccess("Username updated successfully");
    setNewUsername("");
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    const validation = validatePassword(newPassword);
    if (!validation.success) {
      setPasswordError(validation.error);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordLoading(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setPasswordLoading(false);

    if (error) {
      setPasswordError(error.message ?? "Failed to change password");
      return;
    }

    setPasswordSuccess("Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function handleSignOut() {
    setSigningOut(true);
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-3 sm:p-4">
      <GlowContainer
        intensity="sm"
        hover={false}
        className="w-full max-w-md border-none bg-transparent p-0"
      >
        <HUDFrame label="Account Settings">
          <div className="space-y-5 sm:space-y-6">
            <div className="text-center">
              <h1 className="text-primary glow-text text-xl font-bold tracking-wider sm:text-2xl">
                ACCOUNT
              </h1>
              <p className="text-muted-foreground mt-1 font-mono text-xs">
                {session.user.username ?? session.user.name}
              </p>
            </div>

            {/* Change Username */}
            <form onSubmit={handleChangeUsername} className="space-y-4">
              <Divider label="Change Username" variant="glow" />
              <p className="text-muted-foreground font-mono text-[10px]">
                Current: {session.user.username ?? "Not set"}
              </p>
              <TextInput
                label="New Username"
                placeholder="lowercase_snake_case"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                hint="3-30 chars, lowercase letters, numbers, underscores"
                error={usernameError}
                autoComplete="username"
                required
              />
              {usernameSuccess && (
                <p className="font-mono text-xs text-green-500">
                  {usernameSuccess}
                </p>
              )}
              <Button
                type="submit"
                disabled={usernameLoading}
                className="w-full"
              >
                {usernameLoading ? "Updating..." : "Update Username"}
              </Button>
            </form>

            {/* Change Password */}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Divider label="Change Password" variant="glow" />
              <TextInput
                label="Current Password"
                type="password"
                placeholder="Enter current passphrase"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <TextInput
                label="New Password"
                type="password"
                placeholder="Enter new passphrase"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                hint="Min 12 chars: uppercase, lowercase, number, special char"
                autoComplete="new-password"
                required
              />
              <TextInput
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new passphrase"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              {passwordError && (
                <p className="text-destructive font-mono text-xs">
                  {passwordError}
                </p>
              )}
              {passwordSuccess && (
                <p className="font-mono text-xs text-green-500">
                  {passwordSuccess}
                </p>
              )}
              <Button
                type="submit"
                disabled={passwordLoading}
                className="w-full"
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </Button>
            </form>

            {/* Sign Out & Back */}
            <Divider variant="glow" />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? "Signing Out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </HUDFrame>
      </GlowContainer>
    </div>
  );
}
