"use client";

import { Briefcase, FileTextIcon, Theater } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { SectionWrapper } from "./section-wrapper";

interface History {
  profession: string;
  professionDetails: string;
  mannerisms: string;
}

interface HistorySectionProps {
  history: History;
  onHistoryChange: (history: History) => void;
}

export function HistorySection({
  history,
  onHistoryChange,
}: HistorySectionProps) {
  const summary = history.profession
    ? `"${history.profession}"`
    : "NO PROFESSION";

  return (
    <SectionWrapper
      title="Historical Data"
      sectionId="05.HIS"
      defaultOpen={true}
      collapsedSummary={summary}
    >
      <div className="space-y-4">
        {/* Profession/Talent */}
        <div className="bg-secondary/30 border-border rounded border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Briefcase className="text-primary h-4 w-4" />
            <span className="text-muted-foreground font-mono text-xs">
              [PRO]
            </span>
            <span className="text-sm font-bold tracking-wider uppercase">
              Profession / Talent
            </span>
          </div>
          <Input
            value={history.profession}
            onChange={(e) =>
              onHistoryChange({ ...history, profession: e.target.value })
            }
            placeholder="Enter profession or talent..."
            className="bg-background/50 border-border/50 font-mono"
          />
        </div>

        {/* Profession Details */}
        <div className="bg-secondary/30 border-border rounded border p-4">
          <div className="mb-3 flex items-center gap-2">
            <FileTextIcon size={16} className="text-primary" />
            <span className="text-muted-foreground font-mono text-xs">
              [DTL]
            </span>
            <span className="text-sm font-bold tracking-wider uppercase">
              Profession Details
            </span>
          </div>
          <Textarea
            value={history.professionDetails}
            onChange={(e) =>
              onHistoryChange({ ...history, professionDetails: e.target.value })
            }
            placeholder="Describe your expertise, training, notable achievements..."
            className="bg-background/50 border-border/50 min-h-25 resize-none font-mono text-sm"
          />
        </div>

        {/* Mannerisms */}
        <div className="bg-secondary/30 border-border rounded border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Theater className="text-primary h-4 w-4" />
            <span className="text-muted-foreground font-mono text-xs">
              [MAN]
            </span>
            <span className="text-sm font-bold tracking-wider uppercase">
              Mannerisms
            </span>
          </div>
          <Textarea
            value={history.mannerisms}
            onChange={(e) =>
              onHistoryChange({ ...history, mannerisms: e.target.value })
            }
            placeholder="Habits, quirks, speech patterns, physical tells..."
            className="bg-background/50 border-border/50 min-h-20 resize-none font-mono text-sm"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
