"use client";

import { Minus, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { SectionWrapper } from "./section-wrapper";

interface Vitals {
  hp: { current: number };
  stress: { current: number };
}

interface VitalsSectionProps {
  vitals: Vitals;
  maxHp: number;
  maxStress: number;
  onVitalsChange: (vitals: Vitals) => void;
}

interface VitalBarProps {
  label: string;
  code: string;
  current: number;
  max: number;
  onCurrentChange: (value: number) => void;
  color: "primary" | "destructive";
}

function VitalBar({
  label,
  code,
  current,
  max,
  onCurrentChange,
  color,
}: VitalBarProps) {
  const percentage = max > 0 ? (current / max) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-mono text-xs">
            [{code}]
          </span>
          <span className="text-sm font-bold tracking-wider uppercase">
            {label}
          </span>
        </div>
      </div>

      {/* Visual bar */}
      <div className="bg-secondary border-border relative h-6 overflow-hidden rounded border">
        <div
          className={cn(
            "absolute inset-y-0 left-0 transition-all duration-300",
            color === "primary" ? "bg-primary" : "bg-destructive",
          )}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-foreground font-mono text-xs font-bold drop-shadow-lg">
            {current} / {max}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-mono text-xs">
            CURRENT:
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onCurrentChange(Math.max(0, current - 1))}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <input
              type="number"
              value={current}
              onChange={(e) =>
                onCurrentChange(
                  Math.max(0, Math.min(max, parseInt(e.target.value, 10) || 0)),
                )
              }
              className="bg-secondary border-border h-7 w-12 rounded border text-center font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onCurrentChange(Math.min(max, current + 1))}
            >
              <PlusIcon size={12} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VitalsSection({
  vitals,
  maxHp,
  maxStress,
  onVitalsChange,
}: VitalsSectionProps) {
  const summary = `HP: ${vitals.hp.current}/${maxHp} | STR: ${vitals.stress.current}/${maxStress}`;

  return (
    <SectionWrapper
      title="Vital Signs"
      sectionId="03.VIT"
      defaultOpen={true}
      collapsedSummary={summary}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <VitalBar
          label="Health Points"
          code="HP"
          current={vitals.hp.current}
          max={maxHp}
          onCurrentChange={(value) =>
            onVitalsChange({ ...vitals, hp: { current: value } })
          }
          color="primary"
        />
        <VitalBar
          label="Stress Level"
          code="STR"
          current={vitals.stress.current}
          max={maxStress}
          onCurrentChange={(value) =>
            onVitalsChange({
              ...vitals,
              stress: { current: value },
            })
          }
          color="destructive"
        />
      </div>
    </SectionWrapper>
  );
}
