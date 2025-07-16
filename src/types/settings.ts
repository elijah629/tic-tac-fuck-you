export interface Soundtrack {
  name: string,
  author: { name: string, link: string },
  source: string,
  url: string
}

export const SOUNDTRACKS: Soundtrack[] = [
  {
    name: "BALATRO [6-N163]",
    author: { name: "Lucas Pucas", link: "https://x.com/lucaspucasmusic" },
    source: "https://www.youtube.com/watch?v=yXg7R64LnKM",
    url: "/balatro-n163.opus",
  },
];

export enum SFX {
  WIN = "/win.mp3"
}

export interface GameSettings {
  volume: Volumes;
  soundtrackId: number;
  audioContext?: AudioContext;

  getAudioContext(): AudioContext;
  setVolume(volume: Volumes): void;
  setTrack(id: number): void;
}

export interface Volumes {
  master: number;
  sfx: number;
  soundtrack: number;
}
