import { Team } from "@/lib/game";

export function PlayerIndicator({ team }: { team: Team }) {
    return <div className="bg-secondary aspect-square rounded-xl text-center">
    <TeamSymbol team={team}/>
  </div>
}

function TeamSymbol({ team }: { team: Team }) {
  if (team == Team.O) {
      return <span className="text-ally text-8xl ml-1">O</span>;
  }

  if (team == Team.X) {
      return <span className="text-enemy text-8xl ml-1">X</span>;
  }
}
