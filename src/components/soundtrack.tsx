"use client";

import { perceivedVolume } from "@/lib/audio";
import { useGameSettings } from "@/lib/settings";
import { SOUNDTRACKS } from "@/types/settings";
import { useEffect, useRef } from "react";

export default function Soundtrack() {
  const { volume, soundtrackId, getAudioContext, audioContext } =
    useGameSettings();

  const gain = useRef<GainNode | null>(null);

  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audio.current) {
      audio.current = new Audio(SOUNDTRACKS[soundtrackId].url);
      audio.current.loop = true;
    }

    function handleClick() {
      if (!audio.current || !!audioContext) return;

      const ctx = getAudioContext()!;

      const track = ctx.createMediaElementSource(audio.current);
      gain.current = ctx.createGain();

      gain.current.gain.value = perceivedVolume(volume.master * volume.soundtrack);

      track.connect(gain.current).connect(ctx.destination);

      audio.current.play();
    }

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [
    volume.master,
    volume.soundtrack,
    audioContext,
    getAudioContext,
    soundtrackId,
  ]);

  useEffect(() => {
    if (!gain.current) return;

    gain.current.gain.value = perceivedVolume(volume.master * volume.soundtrack);
  }, [volume.master, volume.soundtrack]);

  return null;
}
