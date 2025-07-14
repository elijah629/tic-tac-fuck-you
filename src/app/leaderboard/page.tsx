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
import { auth, signIn } from "@/lib/auth";
import { ratelimit, redis } from "@/lib/redis";

const TOP = 20;
const medalMap = ["🥇", "🥈", "🥉"];

type Leaderboard = LeaderboardItem[];
type LeaderboardItem = [string, number];

export default async function Leaderboard() {
  const session = await auth();
  const id = session?.user?.name;

  // Attach all "free" requests to the same ID in the database.
  const { success } = await ratelimit.blockUntilReady(
    id ?? "GHOST_USER",
    10_000,
  );

  if (!success && !id) await signIn();
  if (!success && id) return <>429. Too many requests! Try again later</>;

  const raw = await redis.zrange("leaderboard", 0, TOP - 1, {
    withScores: true,
    rev: true,
  });

  const leaderboard: [string, number][] = [];

  for (let i = 0; i < raw.length; i += 2) {
    const user = raw[i] as string;
    const wins = Number(raw[i + 1]);
    leaderboard.push([user, wins]);
  }

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
    <main className="flex w-full justify-center p-4">
      <Table className="max-w-3xl mx-auto text-2xl">
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
                {medalMap[rank] ?
                  <span className="text-3xl -m-4">{medalMap[rank]} {name} {medalMap[rank]}</span> :
                  <><span className="text-3xl">{rank + 1}. </span> {name}</>
                }
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
