"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function ImpersonationBanner({
  impersonatingAs,
}: {
  impersonatingAs: string;
}) {
  const router = useRouter();

  async function handleStop() {
    await authClient.admin.stopImpersonating();
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex items-center justify-center gap-4 border-b border-yellow-500/30 bg-yellow-500/10 px-4 py-2 backdrop-blur-sm">
      <span className="font-mono text-xs text-yellow-400">
        ⚠ Impersonating: {impersonatingAs}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleStop}
        className="border-yellow-500/40 text-[10px] text-yellow-400 hover:bg-yellow-500/20"
      >
        Stop Impersonating
      </Button>
    </div>
  );
}
