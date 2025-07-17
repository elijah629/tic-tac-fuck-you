export interface Soundtrack {
  name: string;
  author: { name: string; link: string };
  source: string;
  url: string;
}

export enum SOUNDTRACK_SOUNDS {
  BALATRO_N163 = "/balatro-n163.opus",
}

export enum SFX_SOUNDS {
  WIN = "/win.mp3",
  POWERUP = "/powerup.wav",
}

export const SOUNDTRACKS: Soundtrack[] = [
  {
    name: "BALATRO [6-N163]",
    author: { name: "Lucas Pucas", link: "https://x.com/lucaspucasmusic" },
    source: "https://www.youtube.com/watch?v=yXg7R64LnKM",
    url: SOUNDTRACK_SOUNDS.BALATRO_N163,
  },
];

export interface GameSettings {
  volume: Volumes;
  soundtrackId: number;
  audioContext?: AudioContext;

  loadAllTracks(): Promise<void>;
  play(sound: string, loop: boolean): void;

  setVolume(volume: Volumes): void;
  setTrack(id: number): void;
}

export interface Volumes {
  master: number;
  sfx: number;
  soundtrack: number;
}
