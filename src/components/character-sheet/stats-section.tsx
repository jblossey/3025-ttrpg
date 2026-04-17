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
    <div className="bg-secondary/30 border-border flex flex-col items-center rounded border p-4">
      <span className="text-muted-foreground mb-1 font-mono text-xs">
        [{code}]
      </span>
      <span className="text-foreground mb-3 text-sm font-bold tracking-wider uppercase">
        {label}
      </span>
      <div className="flex gap-2">
        {statValues.map((statValue) => (
          <Button
            variant="ghost"
            key={statValue}
            onClick={() => onChange(statValue)}
            className={cn(
              "h-10 w-10 rounded border-2 font-mono text-lg font-bold transition-all",
              value === statValue
                ? "bg-primary text-primary-foreground border-primary glow"
                : "bg-secondary border-border text-muted-foreground hover:border-primary/50",
            )}
          >
            {statValue >= 0 ? `+${statValue}` : statValue}
          </Button>
        ))}
      </div>
      <div className="bg-border mt-2 h-0.5 w-full">
        <div
          className="bg-primary h-full transition-all duration-300"
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
        <span className="text-muted-foreground font-mono text-xs">
          STAT RANGE: -1 TO +2
        </span>
        <span className="text-primary hidden font-mono text-xs sm:inline">
          |
        </span>
        <span className="text-muted-foreground font-mono text-xs">
          TOTAL: {stats.body + stats.intelligence + stats.charisma}
        </span>
      </div>
    </SectionWrapper>
  );
}
