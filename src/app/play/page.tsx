import { AIPlayer } from "@/components/ai-player";
import { Board } from "@/components/board";
import { HumanPlayer } from "@/components/human-player";
import { XpSidebar } from "@/components/xp-sidebar";

export default function Play() {
  return <main className="flex">
    <XpSidebar/>
    <div className="flex w-full flex-col">
      <AIPlayer/>
      <Board/>
      <HumanPlayer/>
    </div>
  </main>
}
