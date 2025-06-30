import { Cell as C } from "@/lib/game";

export default function Cell({ cell }: { cell: C }) {
    if (cell == C.X) {
        return <span className="text-enemy">X</span>;
    }

    if (cell == C.O) {
      return <span className="text-enemy">O</span>;
    }

  if (cell == C.Empty) {
    return null;
  }

  if (cell = C.Neutral) {
   return <div className="bg-neutral">.</div>
  }
}
