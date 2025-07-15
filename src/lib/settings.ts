"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameSettings } from "@/types/settings";

export const useGameSettings = create(
  persist<GameSettings>(
    (set, get) => ({
      volume: {
        master: 1,
        sfx: 1,
        soundtrack: 1,
      },
      soundtrackId: 0,

      getAudioContext: () => {
        const { audioContext } = get();
        if (audioContext) return audioContext;

        const newAudioContext = new AudioContext();

        set({ audioContext: newAudioContext });

        return newAudioContext;
      },
      setVolume: (volume) => set({ volume }),
      setTrack: (soundtrackId) => set({ soundtrackId }),
    }),
    {
      name: "settings",
      partialize(state) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { audioContext, ...persistedState } = state;

        return persistedState;
      },
    },
  ),
);
