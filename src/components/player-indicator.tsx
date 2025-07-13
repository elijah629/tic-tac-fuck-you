import { Team } from "@/types/game";
import { cn } from "@/lib/utils";

export function PlayerIndicator({
  active,
  team,
}: {
  active: boolean;
  team: Team | string;
}) {
  return (
    <div
      className={cn(
        "bg-secondary h-25 w-25 rounded-xl flex items-center justify-center",
        active && "animate-caret-blink",
      )}
    >
      <TeamSymbol team={team} />
    </div>
  );
}

function TeamSymbol({ team }: { team: Team | string }) {
  if (team === Team.O) {
    return <span className="text-ally text-8xl ml-1">{Team.O}</span>;
  }

  if (team === Team.X) {
    return <span className="text-enemy text-8xl ml-1">{Team.X}</span>;
  }

  return <span className="text-5xl ml-1">{team}</span>;
}
