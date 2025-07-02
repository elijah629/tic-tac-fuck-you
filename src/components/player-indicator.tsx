import { Team } from "@/lib/game";
import { cn } from "@/lib/utils";

export function PlayerIndicator({ active, team }: { active: boolean, team: Team }) {
  return (
    <div className={cn("flex items-center justify-center h-27 w-27 before:content-[''] before:absolute before:inset-0 before:-z-10 before:rounded-xl", active && "before:bg-yellow-500")}>
      <div className="bg-secondary h-25 w-25 rounded-xl text-center">
        <TeamSymbol team={team} />
      </div>
    </div>
  );
}

function TeamSymbol({ team }: { team: Team }) {
  if (team === Team.O) {
    return <span className="text-ally text-8xl ml-1">O</span>;
  }

  if (team === Team.X) {
    return <span className="text-enemy text-8xl ml-1">X</span>;
  }
}
