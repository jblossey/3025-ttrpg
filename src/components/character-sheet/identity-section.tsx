"use client";

import { Input } from "@/components/ui/input";
import { SectionWrapper } from "./section-wrapper";

interface IdentitySectionProps {
  name: string;
  onNameChange: (name: string) => void;
}

export function IdentitySection({ name, onNameChange }: IdentitySectionProps) {
  const summary = name ? `"${name}"` : "UNNAMED";

  return (
    <SectionWrapper
      title="Identity"
      sectionId="01.ID"
      defaultOpen={true}
      collapsedSummary={summary}
    >
      <div className="space-y-2">
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="ENTER CHARACTER NAME"
          className="text-2xl font-bold tracking-wider h-14 bg-secondary/30 border-primary/30 
                     focus:border-primary focus:glow text-primary placeholder:text-muted-foreground/50
                     font-mono uppercase"
        />
      </div>
    </SectionWrapper>
  );
}
