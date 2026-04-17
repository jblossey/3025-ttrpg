"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

interface HUDFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function HUDFrame({
  label,
  children,
  className,
  ...props
}: HUDFrameProps) {
  return (
    <div
      data-slot="tron-hud-frame"
      className={cn(
        "border-primary/30 bg-background/50 relative border backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      {/* Top left corner */}
      <div className="border-primary absolute -top-px -left-px h-4 w-4 border-t-2 border-l-2" />
      {/* Top right corner */}
      <div className="border-primary absolute -top-px -right-px h-4 w-4 border-t-2 border-r-2" />
      {/* Bottom left corner */}
      <div className="border-primary absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2" />
      {/* Bottom right corner */}
      <div className="border-primary absolute -right-px -bottom-px h-4 w-4 border-r-2 border-b-2" />

      {/* Label */}
      {label && (
        <div className="bg-background text-primary absolute -top-3 left-4 px-2 text-[10px] tracking-widest uppercase">
          {label}
        </div>
      )}

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative p-4">{children}</div>
    </div>
  );
}
