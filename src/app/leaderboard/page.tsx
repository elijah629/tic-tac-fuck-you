import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { redis } from "@/lib/redis";

const TOP = 10;

const medalMap = ["🥇", "🥈", "🥉"];

type Leaderboard = LeaderboardItem[];
type LeaderboardItem = [string, number];

export default async function Leaderboard() {
  // TODO: See if NextJS Caches this
  // IF NOT: Ratelimit by slack id and make all pages require auth
  async function getRange(from: number, to: number): Promise<Leaderboard> {
    "use server";

    const raw = await redis.zrange("leaderboard", from, to, {
      withScores: true,
      rev: true,
    });

    const leaderboard: [string, number][] = [];

    for (let i = 0; i < raw.length; i += 2) {
      const user = raw[i] as string;
      const wins = Number(raw[i + 1]);
      leaderboard.push([user, wins]);
    }

    return leaderboard;
  }

  const leaderboard: Leaderboard = await getRange(0, TOP);

  const ranked = leaderboard.reduce(
    (
      acc: { name: string; wins: number; rank: number }[],
      [name, wins],
      idx,
    ) => {
      if (idx === 0) {
        acc.push({ name, wins, rank: 0 });
      } else {
        const prev = acc[idx - 1];
        if (wins === prev.wins) {
          acc.push({ name, wins, rank: prev.rank });
        } else {
          acc.push({ name, wins, rank: prev.rank + 1 });
        }
      }
      return acc;
    },
    [],
  );

  return (
    <main className="flex w-full justify-center">
      <Table className="max-w-3xl mx-auto  text-2xl">
        <TableCaption>
          Top {leaderboard.length} performing specimen
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Wins</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ranked.map(({ name, wins, rank }) => (
            <TableRow key={name}>
              <TableCell className="font-medium">
                {name} {medalMap[rank] ?? "#" + rank + "."}
              </TableCell>
              <TableCell className="text-right">{wins}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total Wins</TableCell>
            <TableCell className="text-right">
              {leaderboard.map(([, wins]) => wins).reduce((a, b) => a + b)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </main>
  );
}
