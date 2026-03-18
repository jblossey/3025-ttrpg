"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { HUDFrame } from "@/components/thegridcn/hud-frame";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Divider } from "../thegridcn/divider";

interface SectionWrapperProps {
  title: string;
  sectionId: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  collapsedSummary?: string;
}

export function SectionWrapper({
  title,
  sectionId,
  children,
  defaultOpen = true,
  className,
  collapsedSummary,
}: SectionWrapperProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <HUDFrame
        label={`[${sectionId}] ${title}`}
        className={cn("transition-all duration-200", className)}
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-end hover:bg-secondary/50 transition-colors cursor-pointer -mt-2 -mx-4 px-4 py-2">
            <div className="flex items-center gap-2">
              {!isOpen && collapsedSummary && (
                <span className="text-[10px] font-mono text-muted-foreground/80 hidden sm:block">
                  {collapsedSummary}
                </span>
              )}
              <span className="text-xs font-mono text-muted-foreground">
                {isOpen ? "EXPANDED" : "COLLAPSED"}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-primary transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </div>
          </div>
        </CollapsibleTrigger>
        {isOpen && <Divider variant="dashed" />}
        <CollapsibleContent>
          <div className="pt-4">{children}</div>
        </CollapsibleContent>
      </HUDFrame>
    </Collapsible>
  );
}
