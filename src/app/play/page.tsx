import { AIPlayer } from "@/components/ai-player";
import { Board } from "@/components/board";
import { HumanPlayer } from "@/components/human-player";
import { XpSidebar } from "@/components/xp-sidebar";

export default function Play() {
  return (
    <main className="grid max-h-full grid-cols-[1fr_2fr] gap-4">
      <XpSidebar className="row-span-3" />
      <AIPlayer />
      <Board className="col-start-2 row-start-2" />
      <HumanPlayer className="col-start-2 row-start-3" />
    </main>
  );
}
