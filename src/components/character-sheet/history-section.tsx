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
        <div className="bg-secondary/30 border border-border rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-muted-foreground">
              [PRO]
            </span>
            <span className="text-sm font-bold uppercase tracking-wider">
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
        <div className="bg-secondary/30 border border-border rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileTextIcon size={16} className="text-primary" />
            <span className="text-xs font-mono text-muted-foreground">
              [DTL]
            </span>
            <span className="text-sm font-bold uppercase tracking-wider">
              Profession Details
            </span>
          </div>
          <Textarea
            value={history.professionDetails}
            onChange={(e) =>
              onHistoryChange({ ...history, professionDetails: e.target.value })
            }
            placeholder="Describe your expertise, training, notable achievements..."
            className="min-h-25 bg-background/50 border-border/50 resize-none font-mono text-sm"
          />
        </div>

        {/* Mannerisms */}
        <div className="bg-secondary/30 border border-border rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <Theater className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-muted-foreground">
              [MAN]
            </span>
            <span className="text-sm font-bold uppercase tracking-wider">
              Mannerisms
            </span>
          </div>
          <Textarea
            value={history.mannerisms}
            onChange={(e) =>
              onHistoryChange({ ...history, mannerisms: e.target.value })
            }
            placeholder="Habits, quirks, speech patterns, physical tells..."
            className="min-h-20 bg-background/50 border-border/50 resize-none font-mono text-sm"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
