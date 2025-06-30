import { Cell as C } from "@/lib/game";

export default function Cell({ cell }: { cell: C }) {
    if (cell == C.X) {
        return <span className="text-enemy text-9xl leading-none">X</span>;
    }

    if (cell == C.O) {
      return <span className="text-ally text-9xl">O</span>;
    }

  if (cell == C.Empty) {
    return null;
  }

  if (cell = C.Neutral) {
   return <div className="bg-neutral text-9xl w-full h-full text-center">?</div>
  }
}
