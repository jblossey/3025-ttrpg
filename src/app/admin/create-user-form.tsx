"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HUDFrame } from "@/components/thegridcn/hud-frame";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { authClient } from "@/lib/auth-client";
import { validatePassword, validateUsername } from "@/lib/validation";

export function CreateUserForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  function resetForm() {
    setName("");
    setEmail("");
    setUsername("");
    setPassword("");
    setRole("user");
    setError("");
    setSuccess("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (username) {
      const usernameCheck = validateUsername(username);
      if (!usernameCheck.success) {
        setError(usernameCheck.error);
        return;
      }
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.success) {
      setError(passwordCheck.error);
      return;
    }

    setLoading(true);

    const { error: createError } = await authClient.admin.createUser({
      email,
      password,
      name,
      role,
      data: username ? { username, displayUsername: username } : {},
    });

    setLoading(false);

    if (createError) {
      setError(createError.message ?? "Failed to create user");
      return;
    }

    setSuccess(`User "${name}" created successfully`);
    resetForm();
    router.refresh();
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        + Create User
      </Button>
    );
  }

  return (
    <HUDFrame label="Create User">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Name"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            size="sm"
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            size="sm"
          />
          <TextInput
            label="Username"
            placeholder="Callsign (optional)"
            hint="lowercase_snake_case, 3-30 chars"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="sm"
          />
          <TextInput
            label="Password"
            type="password"
            placeholder="Secure passphrase"
            hint="Min 12 chars: upper, lower, number, special"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            size="sm"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-mono text-[9px] uppercase tracking-widest text-foreground/40">
            Role
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "user" | "admin")}
              className="mt-1 block w-full rounded border border-primary/20 bg-card/60 px-3 py-1.5 font-mono text-[10px] text-foreground/80 outline-none backdrop-blur-sm transition-all focus:border-primary/40 focus:shadow-[0_0_8px_rgba(var(--primary-rgb,0,180,255),0.1)]"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>

        {error && <p className="font-mono text-xs text-destructive">{error}</p>}
        {success && (
          <p className="font-mono text-xs text-green-500">{success}</p>
        )}

        <div className="flex gap-2">
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setOpen(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </HUDFrame>
  );
}
