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
    <div className="min-h-screen bg-background grid-lines">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LocationDisplay sector="SOLARIS 7" status="HOSTILE" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground">
                {character.name || "UNNAMED"} | HP:{" "}
                {character.vitals.hp.current}/{maxHp}
              </span>
              {SAVE_STATUS_LABELS[saveStatus] && (
                <span
                  className={`text-[10px] font-mono uppercase tracking-widest ${SAVE_STATUS_COLORS[saveStatus]}`}
                >
                  {SAVE_STATUS_LABELS[saveStatus]}
                </span>
              )}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="font-mono uppercase tracking-wider no-print"
              >
                Print Sheet
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        className="max-w-5xl mx-auto px-4 py-6 space-y-4"
        suppressHydrationWarning
      >
        {/* Title Banner */}
        <HUDFrame>
          <div className="flex items-center justify-between px-4 py-4 md:px-8 md:py-6">
            {/* HP Gauge */}
            <div className="flex-shrink-0">
              <Gauge
                value={character.vitals.hp.current}
                max={maxHp}
                label="HP"
                size="md"
                variant={
                  character.vitals.hp.current / maxHp >= 0.66
                    ? "success"
                    : character.vitals.hp.current / maxHp < 0.33
                      ? "danger"
                      : "warning"
                }
              />
            </div>

            {/* Character Info */}
            <div className="flex-1 text-center px-4">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary glow-text truncate">
                {character.name || "Unnamed Character"}
              </h1>
              <p className="text-xs font-mono text-muted-foreground mt-1 tracking-wider truncate">
                {character.history.profession || "No Profession"}
              </p>
            </div>

            {/* Stress Gauge */}
            <div className="flex-shrink-0">
              <Gauge
                value={character.vitals.stress.current}
                max={maxStress}
                label="STR"
                size="md"
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
