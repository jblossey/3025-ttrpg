"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface CharacterNavItem {
  id: string;
  name: string;
  ownerName: string;
}

export function CharacterNav({
  characters,
  isImpersonating,
}: {
  characters: CharacterNavItem[];
  isImpersonating?: boolean;
}) {
  const params = useParams();
  const currentId = params.id as string | undefined;

  if (characters.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-40 border-b border-primary/20 bg-background/95 backdrop-blur-sm",
        isImpersonating ? "top-10" : "top-0",
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-1.5">
        <span className="mr-2 shrink-0 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          Characters
        </span>
        {characters.map((c) => (
          <Link
            key={c.id}
            href={`/character/${c.id}`}
            className={cn(
              "shrink-0 rounded px-2 py-1 font-mono text-[10px] transition-colors",
              currentId === c.id
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
            )}
          >
            {c.name || "Unnamed"}{" "}
            <span className="text-muted-foreground/50">({c.ownerName})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
