"use client";

import { pause, play, close, useGameSettings } from "@/lib/settings";
import { SOUNDTRACKS } from "@/types/settings";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Soundtrack() {
  const { soundtrackId, loadAllTracks } = useGameSettings();

  const [isInit, setInit] = useState(false);
  const playing = useRef<string | null>(null);

  const handleClick = useCallback(async () => {
    await loadAllTracks();
    play(SOUNDTRACKS[soundtrackId].url, true);
    playing.current = SOUNDTRACKS[soundtrackId].url;

    setInit(true);
  }, [loadAllTracks, soundtrackId]);

  useEffect(() => {
    if (!isInit) {
      window.addEventListener("click", handleClick, { once: true });
    }
  }, [handleClick, isInit]);

  useEffect(() => () => close(), []);

  useEffect(() => {
    if (!isInit) return;

    if (playing.current) {
      pause(playing.current);
      play(SOUNDTRACKS[soundtrackId].url, true);

      playing.current = SOUNDTRACKS[soundtrackId].url;
    }
  }, [soundtrackId, isInit]);

  return null;
}
