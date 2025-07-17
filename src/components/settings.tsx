"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AudioLinesIcon,
  LucideChevronLeft,
  LucideChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import { useGameSettings } from "@/lib/settings";
import { SOUNDTRACKS } from "@/types/settings";

export function Settings() {
  const { volume, soundtrackId, setVolume, setTrack } = useGameSettings();

  const [open, setOpen] = useState<boolean>(false);

  const track = SOUNDTRACKS[soundtrackId];

  return (
    <>
      <span className="fixed text-sm bottom-10 left-10 z-30">
        Playing{" "}
        <Link href={track.source} className="underline">
          {track.name}
        </Link>{" "}
        by{" "}
        <Link href={track.author.link} className="underline">
          {track.author.name}
        </Link>
      </span>

      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className="fixed bottom-10 right-10 z-30"
            size="icon"
            variant="outline"
          >
            <AudioLinesIcon size={24} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Audio Settings</h4>
              <p className="text-sm">Soundtrack</p>
            </div>
            <div className="flex justify-between items-center gap-2">
              <Button
                size="icon"
                disabled={soundtrackId === 0}
                onClick={() => {
                  setTrack(soundtrackId - 1);
                }}
              >
                <LucideChevronLeft size={24} />
              </Button>
              <div className="bg-secondary rounded-md px-4 py-2 flex flex-col">
                <Link href={track.source} className="underline">
                  {track.name}
                </Link>
                <span className="text-sm">
                  By{" "}
                  <Link href={track.author.link} className="underline">
                    {track.author.name}
                  </Link>
                </span>
              </div>
              <Button
                size="icon"
                disabled={soundtrackId === SOUNDTRACKS.length - 1}
                onClick={() => {
                  setTrack(soundtrackId + 1);
                }}
              >
                <LucideChevronRight size={24} />
              </Button>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="master">Master Volume</Label>
                <Slider
                  id="master"
                  value={[volume.master * 100]}
                  onValueChange={([v]) => {
                    setVolume({ ...volume, master: v / 100 });
                  }}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="sfx">SFX</Label>

                <Slider
                  id="sfx"
                  value={[volume.sfx * 100]}
                  onValueChange={([v]) => {
                    setVolume({ ...volume, sfx: v / 100 });
                  }}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="soundtrack">Soundtrack</Label>
                <Slider
                  id="soundtrack"
                  value={[volume.soundtrack * 100]}
                  onValueChange={([v]) => {
                    setVolume({ ...volume, soundtrack: v / 100 });
                  }}
                  className="col-span-2 h-8"
                />
              </div>
            </div>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              className="text-2xl"
            >
              Close
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
