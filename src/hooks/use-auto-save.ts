"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { updateCharacter } from "@/app/actions/character-actions";
import type { CharacterData } from "@/types/character";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutoSave(characterId: string, data: CharacterData) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const latestData = useRef(data);

  latestData.current = data;

  // Serialize data to detect actual value changes
  const serialized = useMemo(() => JSON.stringify(data), [data]);

  const save = useCallback(async () => {
    setStatus("saving");
    const result = await updateCharacter(characterId, latestData.current);
    if (result && "error" in result) {
      setStatus("error");
    } else {
      setStatus("saved");
    }
  }, [characterId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: serialized triggers debounce on data changes
  useEffect(() => {
    // Skip auto-save on initial mount (data hasn't changed yet)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setStatus("idle");
    timeoutRef.current = setTimeout(() => {
      save();
    }, 1500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [serialized, save]);

  return status;
}
