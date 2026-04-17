"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";
import { authClient } from "@/lib/auth-client";
import { ROLES, type Role } from "@/lib/roles";
import { validatePassword } from "@/lib/validation";

import { UserSessions } from "./user-sessions";

interface AdminActionsProps {
  userId: string;
  userName: string;
  userEmail: string;
  isBanned: boolean;
  role: string;
  isCurrentUser: boolean;
}

type Panel =
  | "role"
  | "ban"
  | "password"
  | "edit"
  | "sessions"
  | "delete"
  | null;

export function AdminActions({
  userId,
  userName,
  userEmail,
  isBanned,
  role,
  isCurrentUser,
}: AdminActionsProps) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ban form state
  const [banReason, setBanReason] = useState("");
  const [banDays, setBanDays] = useState("");

  // Password form state
  const [newPassword, setNewPassword] = useState("");

  // Edit form state
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);

  // Role form state
  const [selectedRole, setSelectedRole] = useState<Role>(role as Role);

  function togglePanel(p: Panel) {
    setPanel((prev) => (prev === p ? null : p));
    setError("");
  }

  function resetAndClose() {
    setPanel(null);
    setError("");
    setBanReason("");
    setBanDays("");
    setNewPassword("");
    setEditName(userName);
    setEditEmail(userEmail);
    setSelectedRole(role as Role);
  }

  async function handleSetRole() {
    setLoading(true);
    setError("");
    const { error: err } = await authClient.admin.updateUser({
      userId,
      data: { role: selectedRole },
    });
    setLoading(false);
    if (err) {
      setError(err.message ?? "Failed to set role");
      return;
    }
    resetAndClose();
    router.refresh();
  }

  async function handleBan() {
    setLoading(true);
    setError("");
    const { error: err } = await authClient.admin.banUser({
      userId,
      banReason: banReason || undefined,
      banExpiresIn: banDays ? Number(banDays) * 86400 : undefined,
    });
    setLoading(false);
    if (err) {
      setError(err.message ?? "Failed to ban user");
      return;
    }
    resetAndClose();
    router.refresh();
  }

  async function handleUnban() {
    setLoading(true);
    setError("");
    const { error: err } = await authClient.admin.unbanUser({ userId });
    setLoading(false);
    if (err) {
      setError(err.message ?? "Failed to unban user");
      return;
    }
    router.refresh();
  }

  async function handleSetPassword() {
    setError("");

    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.success) {
      setError(passwordCheck.error);
      return;
    }

    setLoading(true);
    const { error: err } = await authClient.admin.setUserPassword({
      userId,
      newPassword,
    });
    setLoading(false);
    if (err) {
      setError(err.message ?? "Failed to set password");
      return;
    }
    setNewPassword("");
    resetAndClose();
    router.refresh();
  }

  async function handleUpdateUser() {
    setLoading(true);
    setError("");
    const data: Record<string, string> = {};
    if (editName !== userName) data.name = editName;
    if (editEmail !== userEmail) data.email = editEmail;

    if (Object.keys(data).length === 0) {
      setError("No changes to save");
      setLoading(false);
      return;
    }

    const { error: err } = await authClient.admin.updateUser({
      userId,
      data,
    });
    setLoading(false);
    if (err) {
      setError(err.message ?? "Failed to update user");
      return;
    }
    resetAndClose();
    router.refresh();
  }

  async function handleImpersonate() {
    setLoading(true);
    setError("");
    const { error: err } = await authClient.admin.impersonateUser({ userId });
    setLoading(false);
    if (err) {
      setError(err.message ?? "Failed to impersonate user");
      return;
    }
    window.location.href = "/";
  }

  async function handleDelete() {
    setLoading(true);
    setError("");
    const { error: err } = await authClient.admin.removeUser({ userId });
    setLoading(false);
    if (err) {
      setError(err.message ?? "Failed to delete user");
      return;
    }
    resetAndClose();
    router.refresh();
  }

  if (isCurrentUser) {
    return <span className="text-muted-foreground text-[9px]">You</span>;
  }

  return (
    <div className="space-y-2">
      {/* Action buttons row */}
      <div className="flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => togglePanel("role")}
          className="text-[10px]"
        >
          Role
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => togglePanel("edit")}
          className="text-[10px]"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => togglePanel("password")}
          className="text-[10px]"
        >
          Password
        </Button>
        {isBanned ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnban}
            disabled={loading}
            className="text-[10px] text-green-500"
          >
            Unban
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => togglePanel("ban")}
            className="text-[10px] text-yellow-500"
          >
            Ban
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => togglePanel("sessions")}
          className="text-[10px]"
        >
          Sessions
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleImpersonate}
          disabled={loading}
          className="text-[10px] text-blue-400"
        >
          Impersonate
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => togglePanel("delete")}
          className="text-destructive text-[10px]"
        >
          Delete
        </Button>
      </div>

      {/* Expandable panels */}
      {error && (
        <p className="text-destructive font-mono text-[10px]">{error}</p>
      )}

      {panel === "role" && (
        <div className="border-primary/10 space-y-2 border-t pt-2">
          <label className="text-foreground/40 block font-mono text-[9px] tracking-widest uppercase">
            Set Role
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="border-primary/20 bg-card/60 text-foreground/80 focus:border-primary/40 mt-1 block rounded border px-2 py-1 font-mono text-[10px] backdrop-blur-sm outline-none"
            >
              <option value={ROLES.USER}>User</option>
              <option value={ROLES.GAMEMASTER}>Gamemaster</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
          </label>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSetRole} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button variant="ghost" size="sm" onClick={resetAndClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {panel === "ban" && (
        <div className="border-primary/10 space-y-2 border-t pt-2">
          <span className="text-foreground/40 block font-mono text-[9px] tracking-widest uppercase">
            Ban User
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <TextInput
              label="Reason"
              placeholder="Ban reason (optional)"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              size="sm"
            />
            <TextInput
              label="Duration (days)"
              type="number"
              placeholder="Permanent if empty"
              value={banDays}
              onChange={(e) => setBanDays(e.target.value)}
              size="sm"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBan}
              disabled={loading}
            >
              {loading ? "Banning..." : "Confirm Ban"}
            </Button>
            <Button variant="ghost" size="sm" onClick={resetAndClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {panel === "password" && (
        <div className="border-primary/10 space-y-2 border-t pt-2">
          <TextInput
            label="New Password"
            type="password"
            placeholder="Enter new password"
            hint="Min 12 chars: upper, lower, number, special"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            size="sm"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSetPassword}
              disabled={loading || !newPassword}
            >
              {loading ? "Setting..." : "Set Password"}
            </Button>
            <Button variant="ghost" size="sm" onClick={resetAndClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {panel === "edit" && (
        <div className="border-primary/10 space-y-2 border-t pt-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <TextInput
              label="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              size="sm"
            />
            <TextInput
              label="Email"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              size="sm"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleUpdateUser} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="ghost" size="sm" onClick={resetAndClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {panel === "sessions" && (
        <div className="border-primary/10 border-t pt-2">
          <UserSessions userId={userId} />
        </div>
      )}

      {panel === "delete" && (
        <div className="border-primary/10 space-y-2 border-t pt-2">
          <p className="text-destructive font-mono text-[10px]">
            Permanently delete this user? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Confirm Delete"}
            </Button>
            <Button variant="ghost" size="sm" onClick={resetAndClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
