"use client";

import Link from "next/link";
import { useImmer } from "use-immer";
import { Button } from "@/components/ui/button";
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

interface CharacterData {
  name: string;
  stats: {
    body: number;
    intelligence: number;
    charisma: number;
  };
  vitals: {
    hp: { current: number; max: number };
    stress: { current: number; max: number };
  };
  psychology: {
    unbreakableConviction: string;
    flexibleConviction: string;
    fearDoubt: string;
  };
  history: {
    profession: string;
    professionDetails: string;
    mannerisms: string;
  };
  connections: Array<{
    id: string;
    name: string;
    description: string;
    relationship: string;
  }>;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
  skillTrees: Array<{
    id: string;
    rootSkill: SkillNodeData;
  }>;
}

interface SkillNodeData {
  id: string;
  name: string;
  proficiency: number;
  children: SkillNodeData[];
}

const initialCharacterData: CharacterData = {
  name: "",
  stats: {
    body: 0,
    intelligence: 0,
    charisma: 0,
  },
  vitals: {
    hp: { current: 12, max: 12 },
    stress: { current: 0, max: 12 },
  },
  psychology: {
    unbreakableConviction: "",
    flexibleConviction: "",
    fearDoubt: "",
  },
  history: {
    profession: "",
    professionDetails: "",
    mannerisms: "",
  },
  connections: [],
  items: [],
  skillTrees: [],
};

interface CharacterSheetProps {
  isAdmin?: boolean;
}

export function CharacterSheet({ isAdmin }: CharacterSheetProps) {
  const [character, updateCharacter] =
    useImmer<CharacterData>(initialCharacterData);

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
                {character.vitals.hp.current}/{character.vitals.hp.max}
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
                max={character.vitals.hp.max}
                label="HP"
                size="md"
                variant={
                  character.vitals.hp.current / character.vitals.hp.max >= 0.66
                    ? "success"
                    : character.vitals.hp.current / character.vitals.hp.max <
                        0.33
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
                max={character.vitals.stress.max}
                label="STR"
                size="md"
                variant={
                  character.vitals.stress.current /
                    character.vitals.stress.max >=
                  0.66
                    ? "danger"
                    : character.vitals.stress.current /
                          character.vitals.stress.max <
                        0.33
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
              draft.vitals.hp.max = 12 + 3 * stats.body;
              draft.vitals.stress.max = 12 + 3 * stats.charisma;
            })
          }
        />

        <VitalsSection
          vitals={character.vitals}
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
