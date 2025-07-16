"use client";

import { useGameSettings } from "@/lib/settings";
import { SOUNDTRACKS } from "@/types/settings";
import { useEffect } from "react";

export default function Soundtrack() {
  const { volume, soundtrackId, play, loadAllTracks, audioContext } =
    useGameSettings();

  useEffect(() => {
    async function handleClick() {
      if (!audioContext) {
        await loadAllTracks();

        play(SOUNDTRACKS[soundtrackId].url, true);
      }
    }

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [
    volume.master,
    volume.soundtrack,
    audioContext,
    loadAllTracks,
    play,
    soundtrackId,
  ]);

  return null;
}
