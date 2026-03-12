"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Divider } from "../thegridcn/divider";
import { SectionWrapper } from "./section-wrapper";

interface Stats {
  body: number;
  intelligence: number;
  charisma: number;
}

interface StatsSectionProps {
  stats: Stats;
  onStatsChange: (stats: Stats) => void;
}

interface StatDisplayProps {
  label: string;
  code: string;
  value: number;
  onChange: (value: number) => void;
}

function StatDisplay({ label, code, value, onChange }: StatDisplayProps) {
  const statValues = [-1, 0, 1, 2];

  return (
    <div className="flex flex-col items-center p-4 bg-secondary/30 border border-border rounded">
      <span className="text-xs font-mono text-muted-foreground mb-1">
        [{code}]
      </span>
      <span className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">
        {label}
      </span>
      <div className="flex gap-2">
        {statValues.map((statValue) => (
          <Button
            variant="ghost"
            key={statValue}
            onClick={() => onChange(statValue)}
            className={cn(
              "w-10 h-10 font-mono text-lg font-bold rounded border-2 transition-all",
              value === statValue
                ? "bg-primary text-primary-foreground border-primary glow"
                : "bg-secondary border-border text-muted-foreground hover:border-primary/50",
            )}
          >
            {statValue >= 0 ? `+${statValue}` : statValue}
          </Button>
        ))}
      </div>
      <div className="mt-2 w-full h-0.5 bg-border">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((value + 1) / 3) * 100}%` }}
        />
      </div>
    </div>
  );
}

function formatStat(value: number): string {
  return value >= 0 ? `+${value}` : `${value}`;
}

export function StatsSection({ stats, onStatsChange }: StatsSectionProps) {
  const summary = `BOD: ${formatStat(stats.body)} | INT: ${formatStat(stats.intelligence)} | CHA: ${formatStat(stats.charisma)}`;

  return (
    <SectionWrapper
      title="Core Attributes"
      sectionId="02.STAT"
      defaultOpen={true}
      collapsedSummary={summary}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatDisplay
          label="Body"
          code="BOD"
          value={stats.body}
          onChange={(value) => onStatsChange({ ...stats, body: value })}
        />
        <StatDisplay
          label="Intelligence"
          code="INT"
          value={stats.intelligence}
          onChange={(value) => onStatsChange({ ...stats, intelligence: value })}
        />
        <StatDisplay
          label="Charisma"
          code="CHA"
          value={stats.charisma}
          onChange={(value) => onStatsChange({ ...stats, charisma: value })}
        />
      </div>
      <Divider variant="dashed" className="my-4" />
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        <span className="text-xs font-mono text-muted-foreground">
          STAT RANGE: -1 TO +2
        </span>
        <span className="hidden sm:inline text-xs font-mono text-primary">
          |
        </span>
        <span className="text-xs font-mono text-muted-foreground">
          TOTAL: {stats.body + stats.intelligence + stats.charisma}
        </span>
      </div>
    </SectionWrapper>
  );
}
