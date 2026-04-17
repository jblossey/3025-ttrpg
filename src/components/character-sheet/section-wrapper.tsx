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
          <div className="hover:bg-secondary/50 -mx-4 -mt-2 flex cursor-pointer items-center justify-end px-4 py-2 transition-colors">
            <div className="flex items-center gap-2">
              {!isOpen && collapsedSummary && (
                <span className="text-muted-foreground/80 hidden font-mono text-[10px] sm:block">
                  {collapsedSummary}
                </span>
              )}
              <span className="text-muted-foreground font-mono text-xs">
                {isOpen ? "EXPANDED" : "COLLAPSED"}
              </span>
              <ChevronDown
                className={cn(
                  "text-primary h-4 w-4 transition-transform duration-200",
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
