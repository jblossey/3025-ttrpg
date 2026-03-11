import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { HUDFrame } from "@/components/ui/hud-frame";
import { GlowContainer } from "@/components/ui/glow-container";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isAdmin = session?.user.role === "admin";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <GlowContainer
        intensity="sm"
        hover={false}
        className="w-full max-w-lg bg-transparent border-none p-0"
      >
        <HUDFrame label="Main Terminal">
          <div className="space-y-6 text-center">
            <h1 className="text-3xl font-bold tracking-wider text-primary glow-text">
              3025
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              SYSTEM ONLINE — AWAITING DIRECTIVES
            </p>
            <div className="mx-auto h-px w-1/2 bg-primary/20" />
            <p className="font-mono text-[10px] text-foreground/40">
              Under construction
            </p>
            {isAdmin && (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin">Admin Panel</Link>
              </Button>
            )}
          </div>
        </HUDFrame>
      </GlowContainer>
    </div>
  );
}
