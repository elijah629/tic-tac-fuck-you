"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameSettings, SFX_SOUNDS, SOUNDTRACK_SOUNDS } from "@/types/settings";
import { perceivedVolume } from "@/lib/audio";

const audioBuffers: Record<
  string,
  { audio: HTMLAudioElement; source: MediaElementAudioSourceNode }
> = {};
let sfxGain: null | GainNode = null;
let soundtrackGain: null | GainNode = null;

export const useGameSettings = create(
  persist<GameSettings>(
    (set, get) => ({
      volume: {
        master: 0.5,
        sfx: 0.5,
        soundtrack: 0.25,
      },
      soundtrackId: 0,

      getAudioContext: () => {
        const { audioContext } = get();
        if (audioContext) return audioContext;

        const newAudioContext = new AudioContext();

        set({ audioContext: newAudioContext });

        return newAudioContext;
      },

      async loadAllTracks() {
        const audioContext = new AudioContext();
        const sfx_sounds = Object.values(SFX_SOUNDS);
        const soundtrack_sounds = Object.values(SOUNDTRACK_SOUNDS);

        sfxGain = audioContext.createGain();
        soundtrackGain = audioContext.createGain();

        async function loadAudioElement(src: string, gainNode: GainNode) {
          if (src in audioBuffers) return;

          const audio = new Audio(src);

          await new Promise<void>((resolve, reject) => {
            audio.addEventListener("canplaythrough", () => resolve(), {
              once: true,
            });
            audio.addEventListener(
              "error",
              () => reject(new Error(`Failed to load audio: ${src}`)),
              { once: true },
            );
          });

          const source = audioContext.createMediaElementSource(audio);
          source.connect(gainNode).connect(audioContext.destination);

          audioBuffers[src] = { audio, source };
        }

        await Promise.all([
          ...sfx_sounds.map((sound) => loadAudioElement(sound, sfxGain!)),
          ...soundtrack_sounds.map((sound) =>
            loadAudioElement(sound, soundtrackGain!),
          ),
        ]);

        set(({ volume }) => {
          sfxGain!.gain.value = perceivedVolume(volume.master * volume.sfx);
          soundtrackGain!.gain.value = perceivedVolume(
            volume.soundtrack * volume.master,
          );

          return {
            audioContext,
          };
        });
      },

      play(sound, loop) {
        const audio = audioBuffers[sound]?.audio;

        if (!audio) {
          return;
        }

        audio.currentTime = 0;
        audio.play();
        audio.loop = loop;
      },

      pause(sound) {
        audioBuffers[sound].audio.pause();
      },

      close() {
        set(({ audioContext }) => {
          if (!audioContext) {
            return {};
          }

          for (const key in audioBuffers) {
            const { audio, source } = audioBuffers[key];

            audio.pause();
            source.disconnect();

            (audioBuffers[key].audio as HTMLAudioElement | null) = null;
          }

          sfxGain?.disconnect();
          soundtrackGain?.disconnect();

          audioContext.close();

          return { audioContext: undefined };
        });
      },

      setVolume: (volume) => {
        sfxGain!.gain.value = perceivedVolume(volume.master * volume.sfx);
        soundtrackGain!.gain.value = perceivedVolume(
          volume.soundtrack * volume.master,
        );

        set({ volume });
      },
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
