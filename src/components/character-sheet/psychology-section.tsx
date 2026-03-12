"use client";

import {
  AlertTriangleIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { SectionWrapper } from "./section-wrapper";

interface Psychology {
  unbreakableConviction: string;
  flexibleConviction: string;
  fearDoubt: string;
}

interface PsychologySectionProps {
  psychology: Psychology;
  onPsychologyChange: (psychology: Psychology) => void;
}

interface ConvictionFieldProps {
  label: string;
  code: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  placeholder: string;
  variant: "unbreakable" | "flexible" | "fear";
}

function ConvictionField({
  label,
  code,
  value,
  onChange,
  icon,
  placeholder,
  variant,
}: ConvictionFieldProps) {
  const borderColors = {
    unbreakable: "border-l-primary",
    flexible: "border-l-chart-2",
    fear: "border-l-destructive",
  };

  return (
    <div
      className={`bg-secondary/30 border border-border rounded p-4 border-l-4 ${borderColors[variant]}`}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs font-mono text-muted-foreground">
          [{code}]
        </span>
        <span className="text-sm font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-20 bg-background/50 border-border/50 resize-none font-mono text-sm"
      />
      <div className="flex items-center gap-2 mt-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] font-mono text-muted-foreground uppercase">
          {value.length}/500
        </span>
      </div>
    </div>
  );
}

export function PsychologySection({
  psychology,
  onPsychologyChange,
}: PsychologySectionProps) {
  const filledCount = [
    psychology.unbreakableConviction,
    psychology.flexibleConviction,
    psychology.fearDoubt,
  ].filter((v) => v.trim().length > 0).length;

  const summary = `${filledCount}/3 DEFINED`;

  return (
    <SectionWrapper
      title="Psychology Matrix"
      sectionId="04.PSY"
      defaultOpen={true}
      collapsedSummary={summary}
    >
      <div className="grid grid-cols-1 gap-4">
        <ConvictionField
          label="Unbreakable Conviction"
          code="UNB"
          value={psychology.unbreakableConviction}
          onChange={(value) =>
            onPsychologyChange({ ...psychology, unbreakableConviction: value })
          }
          icon={<ShieldCheckIcon size={16} className="text-primary" />}
          placeholder="The core belief that defines you... something you would never compromise on."
          variant="unbreakable"
        />
        <ConvictionField
          label="Flexible Conviction"
          code="FLX"
          value={psychology.flexibleConviction}
          onChange={(value) =>
            onPsychologyChange({ ...psychology, flexibleConviction: value })
          }
          icon={<RefreshCwIcon size={16} className="text-chart-2" />}
          placeholder="A belief you hold... but might reconsider under the right circumstances."
          variant="flexible"
        />
        <ConvictionField
          label="Fear / Doubt"
          code="FER"
          value={psychology.fearDoubt}
          onChange={(value) =>
            onPsychologyChange({ ...psychology, fearDoubt: value })
          }
          icon={<AlertTriangleIcon size={16} className="text-destructive" />}
          placeholder="What haunts you in the quiet moments... your deepest fear or nagging doubt."
          variant="fear"
        />
      </div>
    </SectionWrapper>
  );
}
