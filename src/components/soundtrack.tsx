"use client";

import { useGameSettings } from "@/lib/settings";
import { SOUNDTRACKS } from "@/types/settings";
import { useEffect, useRef } from "react";

export default function Soundtrack() {
  const { volume, soundtrackId, getAudioContext, audioContext } = useGameSettings();

  const gain = useRef<GainNode | null>(null);

  const audio = useRef<HTMLMediaElement | null>(null);

  useEffect(() => {
    function handleClick() {
      if (!audio.current || !!audioContext) return;

      const ctx = getAudioContext()!;

      const track = ctx.createMediaElementSource(audio.current);
      gain.current = ctx.createGain();

      gain.current.gain.value = volume.master * volume.soundtrack;

      track.connect(gain.current).connect(ctx.destination);

      audio.current.play();
      audio.current.loop = true;
    }

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [volume.master, volume.soundtrack, audioContext, getAudioContext, soundtrackId]);

  useEffect(() => {
    if (!gain.current) return;

    gain.current.gain.value = volume.master * volume.soundtrack;
  }, [volume.master, volume.soundtrack]);

  return <audio ref={audio} src={SOUNDTRACKS[soundtrackId].url}></audio>;
}
