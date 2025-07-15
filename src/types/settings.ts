export const SOUNDTRACKS = [
  { name: "BALATRO [6-N163]", author: { name: "Lucas Pucas", link: "https://x.com/lucaspucasmusic" }, source: "https://www.youtube.com/watch?v=yXg7R64LnKM", url: "/balatro-n163.opus" }
];


export interface GameSettings {
  volume: Volumes,
  soundtrackId: number,
  audioContext?: AudioContext;

  getAudioContext(): AudioContext,
  setVolume(volume: Volumes): void,
  setTrack(id: number): void,
}

export interface Volumes {
    master: number,
    sfx: number,
    soundtrack: number
  };
