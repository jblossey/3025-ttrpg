"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

interface Session {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  impersonatedBy?: string | null;
}

export function UserSessions({ userId }: { userId: string }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: err } = await authClient.admin.listUserSessions({
      userId,
    });
    setLoading(false);
    if (err) {
      setError(err.message ?? "Failed to load sessions");
      return;
    }
    setSessions(
      ((data as { sessions: Session[] })?.sessions ?? []) as Session[],
    );
  }, [userId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  async function handleRevoke(sessionToken: string) {
    setActionLoading(sessionToken);
    const { error: err } = await authClient.admin.revokeUserSession({
      sessionToken,
    });
    setActionLoading(null);
    if (err) {
      setError(err.message ?? "Failed to revoke session");
      return;
    }
    fetchSessions();
  }

  async function handleRevokeAll() {
    setActionLoading("all");
    const { error: err } = await authClient.admin.revokeUserSessions({
      userId,
    });
    setActionLoading(null);
    if (err) {
      setError(err.message ?? "Failed to revoke sessions");
      return;
    }
    fetchSessions();
  }

  if (loading) {
    return (
      <p className="font-mono text-[10px] text-muted-foreground">
        Loading sessions...
      </p>
    );
  }

  if (error) {
    return (
      <p className="font-mono text-[10px] text-destructive">{error}</p>
    );
  }

  if (sessions.length === 0) {
    return (
      <p className="font-mono text-[10px] text-muted-foreground">
        No active sessions
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-widest text-foreground/40">
          Active Sessions ({sessions.length})
        </span>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleRevokeAll}
          disabled={actionLoading === "all"}
          className="text-[10px]"
        >
          {actionLoading === "all" ? "Revoking..." : "Revoke All"}
        </Button>
      </div>

      <div className="space-y-1">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between rounded border border-primary/10 px-2 py-1"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-mono text-[10px] text-foreground/60">
                <span>
                  {session.ipAddress ?? "Unknown IP"}
                </span>
                {session.impersonatedBy && (
                  <span className="text-yellow-500">[Impersonated]</span>
                )}
              </div>
              <div className="font-mono text-[9px] text-foreground/30">
                {session.userAgent
                  ? session.userAgent.length > 60
                    ? `${session.userAgent.slice(0, 60)}...`
                    : session.userAgent
                  : "Unknown agent"}{" "}
                · Expires{" "}
                {new Date(session.expiresAt).toLocaleDateString()}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRevoke(session.token)}
              disabled={actionLoading === session.token}
              className="text-[10px] text-destructive"
            >
              {actionLoading === session.token ? "..." : "Revoke"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
