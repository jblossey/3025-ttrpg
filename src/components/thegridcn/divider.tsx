"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  variant?: "default" | "glow" | "dashed" | "circuit";
  orientation?: "horizontal" | "vertical";
}

export function Divider({
  label,
  variant = "default",
  orientation = "horizontal",
  className,
  ...props
}: DividerProps) {
  const isHorizontal = orientation === "horizontal";

  if (!isHorizontal) {
    return (
      <div
        data-slot="tron-divider"
        className={cn(
          "relative inline-flex self-stretch",
          variant === "default" && "bg-primary/20 w-px",
          variant === "glow" &&
            "bg-primary/30 w-px shadow-[0_0_4px_var(--primary)]",
          variant === "dashed" &&
            "border-primary/30 w-px border-l border-dashed",
          variant === "circuit" && "bg-primary/20 w-px",
          className,
        )}
        {...props}
      >
        {variant === "circuit" && (
          <div
            className="bg-primary/60 absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
            style={{ animation: "dividerDot 3s ease-in-out infinite" }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      data-slot="tron-divider"
      className={cn("relative flex items-center", className)}
      {...props}
    >
      {/* Left line */}
      <div
        className={cn(
          "flex-1",
          variant === "default" && "bg-primary/20 h-px",
          variant === "glow" &&
            "bg-primary/30 h-px shadow-[0_0_4px_var(--primary)]",
          variant === "dashed" && "border-primary/30 border-t border-dashed",
          variant === "circuit" && "bg-primary/20 h-px",
        )}
      >
        {variant === "circuit" && (
          <>
            <div className="bg-primary/40 absolute top-1/2 left-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full" />
            <div
              className="bg-primary/80 absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full"
              style={{ animation: "dividerDot 3s ease-in-out infinite" }}
            />
          </>
        )}
      </div>

      {/* Label */}
      {label && (
        <span className="text-foreground/30 mx-3 shrink-0 font-mono text-[9px] tracking-widest uppercase">
          {label}
        </span>
      )}

      {/* Right line */}
      <div
        className={cn(
          "flex-1",
          variant === "default" && "bg-primary/20 h-px",
          variant === "glow" &&
            "bg-primary/30 h-px shadow-[0_0_4px_var(--primary)]",
          variant === "dashed" && "border-primary/30 border-t border-dashed",
          variant === "circuit" && "bg-primary/20 h-px",
        )}
      >
        {variant === "circuit" && (
          <div className="bg-primary/40 absolute top-1/2 right-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full" />
        )}
      </div>

      <style jsx>{`
        @keyframes dividerDot {
          0% {
            left: 0%;
          }
          50% {
            left: calc(100% - 4px);
          }
          100% {
            left: 0%;
          }
        }
      `}</style>
    </div>
  );
}
