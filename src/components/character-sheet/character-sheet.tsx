"use client";

import Link from "next/link";
import { useImmer } from "use-immer";

import { Button } from "@/components/ui/button";
import { type SaveStatus, useAutoSave } from "@/hooks/use-auto-save";
import type { CharacterData } from "@/types/character";
import { computeMaxHp, computeMaxStress } from "@/types/character";

import { Gauge } from "../thegridcn/gauge";
import { HUDFrame } from "../thegridcn/hud-frame";
import { LocationDisplay } from "../thegridcn/location-display";
import { ConnectionsSection } from "./connections-section";
import { HistorySection } from "./history-section";
import { IdentitySection } from "./identity-section";
import { InventorySection } from "./inventory-section";
import { PsychologySection } from "./psychology-section";
import { SkillsSection } from "./skills-section";
import { StatsSection } from "./stats-section";
import { VitalsSection } from "./vitals-section";

const SAVE_STATUS_LABELS: Record<SaveStatus, string> = {
  idle: "",
  saving: "SAVING...",
  saved: "SAVED",
  error: "SAVE ERROR",
};

const SAVE_STATUS_COLORS: Record<SaveStatus, string> = {
  idle: "text-muted-foreground",
  saving: "text-yellow-400",
  saved: "text-emerald-400",
  error: "text-red-400",
};

interface CharacterSheetProps {
  characterId: string;
  initialData: CharacterData;
  isAdmin?: boolean;
}

export function CharacterSheet({
  characterId,
  initialData,
  isAdmin,
}: CharacterSheetProps) {
  const [character, updateCharacter] = useImmer<CharacterData>(initialData);
  const saveStatus = useAutoSave(characterId, character);

  const maxHp = computeMaxHp(character.stats.body);
  const maxStress = computeMaxStress(character.stats.charisma);

  return (
    <div className="bg-background grid-lines min-h-screen">
      {/* Header */}
      <header className="bg-background/95 border-border sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="hidden items-center gap-3 md:flex">
              <LocationDisplay sector="SOLARIS 7" status="HOSTILE" />
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              {SAVE_STATUS_LABELS[saveStatus] && (
                <span
                  className={`font-mono text-[10px] tracking-widest uppercase ${SAVE_STATUS_COLORS[saveStatus]}`}
                >
                  {SAVE_STATUS_LABELS[saveStatus]}
                </span>
              )}
              <span className="text-muted-foreground hidden font-mono text-xs md:inline">
                {character.name || "UNNAMED"} | HP:{" "}
                {character.vitals.hp.current}/{maxHp}
              </span>
              {isAdmin && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="no-print"
                >
                  <Link href="/admin">Admin Panel</Link>
                </Button>
              )}
              <Button asChild variant="outline" size="sm" className="no-print">
                <Link href="/account">Settings</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="no-print font-mono tracking-wider uppercase"
              >
                Print Sheet
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        className="mx-auto max-w-5xl space-y-4 px-4 py-6"
        suppressHydrationWarning
      >
        {/* Title Banner */}
        <HUDFrame>
          <div className="flex flex-col items-center gap-2 px-4 py-4 md:flex-row md:justify-between md:px-8 md:py-6">
            <div className="order-first px-4 text-center md:order-2 md:flex-1">
              <h1 className="text-primary glow-text truncate text-lg font-bold tracking-[0.15em] uppercase sm:text-xl sm:tracking-[0.2em] md:text-2xl md:tracking-[0.3em] lg:text-3xl">
                {character.name || "Unnamed Character"}
              </h1>
              <p className="text-muted-foreground mt-1 truncate font-mono text-xs tracking-wider">
                {character.history.profession || "No Profession"}
              </p>
            </div>

            {/* Gauges row - side by side on mobile, flanking name on desktop */}
            <div className="flex items-center justify-center gap-6 md:contents">
              {/* HP Gauge */}
              <div className="shrink-0 origin-center scale-100 md:order-1 md:scale-125">
                <Gauge
                  value={character.vitals.hp.current}
                  max={maxHp}
                  label="HP"
                  size="sm"
                  variant={
                    character.vitals.hp.current / maxHp >= 0.66
                      ? "success"
                      : character.vitals.hp.current / maxHp < 0.33
                        ? "danger"
                        : "warning"
                  }
                />
              </div>

              {/* Stress Gauge */}
              <div className="shrink-0 origin-center scale-100 md:order-3 md:scale-125">
                <Gauge
                  value={character.vitals.stress.current}
                  max={maxStress}
                  label="STR"
                  size="sm"
                  variant={
                    character.vitals.stress.current / maxStress >= 0.66
                      ? "danger"
                      : character.vitals.stress.current / maxStress < 0.33
                        ? "success"
                        : "warning"
                  }
                />
              </div>
            </div>
          </div>
        </HUDFrame>

        {/* Character sections */}
        <IdentitySection
          name={character.name}
          onNameChange={(name) =>
            updateCharacter((draft) => {
              draft.name = name;
            })
          }
        />

        <StatsSection
          stats={character.stats}
          onStatsChange={(stats) =>
            updateCharacter((draft) => {
              draft.stats = stats;
            })
          }
        />

        <VitalsSection
          vitals={character.vitals}
          maxHp={maxHp}
          maxStress={maxStress}
          onVitalsChange={(vitals) =>
            updateCharacter((draft) => {
              draft.vitals = vitals;
            })
          }
        />

        <PsychologySection
          psychology={character.psychology}
          onPsychologyChange={(psychology) =>
            updateCharacter((draft) => {
              draft.psychology = psychology;
            })
          }
        />

        <HistorySection
          history={character.history}
          onHistoryChange={(history) =>
            updateCharacter((draft) => {
              draft.history = history;
            })
          }
        />

        <ConnectionsSection
          connections={character.connections}
          onConnectionsChange={(connections) =>
            updateCharacter((draft) => {
              draft.connections = connections;
            })
          }
        />

        <InventorySection
          items={character.items}
          onItemsChange={(items) =>
            updateCharacter((draft) => {
              draft.items = items;
            })
          }
        />

        <SkillsSection
          skillTrees={character.skillTrees}
          onSkillTreesChange={(skillTrees) =>
            updateCharacter((draft) => {
              draft.skillTrees = skillTrees;
            })
          }
        />
      </main>
    </div>
  );
}
