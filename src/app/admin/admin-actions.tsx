"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

interface AdminActionsProps {
  userId: string;
  isBanned: boolean;
  role: string;
  isCurrentUser: boolean;
}

export function AdminActions({
  userId,
  isBanned,
  role,
  isCurrentUser,
}: AdminActionsProps) {
  const router = useRouter();

  if (isCurrentUser) {
    return <span className="text-[9px] text-muted-foreground">You</span>;
  }

  async function handleBanToggle() {
    if (isBanned) {
      await authClient.admin.unbanUser({ userId });
    } else {
      await authClient.admin.banUser({ userId });
    }
    router.refresh();
  }

  async function handleRoleToggle() {
    const newRole = role === "admin" ? "user" : "admin";
    await authClient.admin.setRole({ userId, role: newRole });
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={handleRoleToggle}>
        {role === "admin" ? "Demote" : "Promote"}
      </Button>
      <Button variant="destructive" size="sm" onClick={handleBanToggle}>
        {isBanned ? "Unban" : "Ban"}
      </Button>
    </div>
  );
}
