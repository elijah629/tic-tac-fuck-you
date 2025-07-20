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
let audioContext: null | AudioContext = null;

export async function play(sound: string, loop: boolean = false, wait: boolean = false): Promise<void> {
  if (loop && wait) {
    throw new Error("waiting on looping audio will wait forever");
  }

  const audio = audioBuffers[sound]?.audio;

  if (!audio) {
    return;
  }

  audio.currentTime = 0;
  await audio.play();

  return new Promise(r => {
    if (loop) {
      audio.loop = loop;
      r(); // Loop never ends, js finish immediately
    } else if (wait) {
      audio.addEventListener("ended", () => {
        r(); // Wait
      }, { once: true });
    }
  });
}

export function pause(sound: string) {
  audioBuffers[sound].audio.pause();
}

export function close() {
  if (!audioContext) {
    return;
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

  sfxGain = null;
  soundtrackGain = null;
  audioContext = null;
}

export const useGameSettings = create(
  persist<GameSettings>(
    (set, get) => ({
      volume: {
        master: 0.5,
        sfx: 0.5,
        soundtrack: 0.25,
      },
      soundtrackId: 0,

      async loadAllTracks() {
        const ctx = new AudioContext();
        const sfx_sounds = Object.values(SFX_SOUNDS);
        const soundtrack_sounds = Object.values(SOUNDTRACK_SOUNDS);

        sfxGain = ctx.createGain();
        soundtrackGain = ctx.createGain();

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

          const source = ctx.createMediaElementSource(audio);
          source.connect(gainNode).connect(ctx.destination);

          audioBuffers[src] = { audio, source };
        }

        await Promise.all([
          ...sfx_sounds.map((sound) => loadAudioElement(sound, sfxGain!)),
          ...soundtrack_sounds.map((sound) =>
            loadAudioElement(sound, soundtrackGain!),
          ),
        ]);

        audioContext = ctx;

        const { volume } = get();

        sfxGain!.gain.value = perceivedVolume(volume.master * volume.sfx);
        soundtrackGain!.gain.value = perceivedVolume(
          volume.soundtrack * volume.master,
        );
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
    },
  ),
);
