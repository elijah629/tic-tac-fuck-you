import { Team } from "@/types/game";
import { cn } from "@/lib/utils";

export function PlayerIndicator({
  active,
  team,
}: {
  active: boolean;
  team: Team;
}) {
  return (
    <div
      className={cn(
        "bg-secondary h-25 w-25 rounded-xl text-center",
        active && "animate-ping",
      )}
    >
      <TeamSymbol team={team} />
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
