import { Button } from "@/components/ui/button";
import { auth, isHardcore, unstable_update } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const hardcore = await isHardcore(session);

  async function toggleHardcoreMode() {
    "use server";

    if (session) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await unstable_update({ user: { hardcore: !hardcore }} as any);
      redirect("/");
    }
  }

  return (
    <main>
      <section className="flex flex-col items-center gap-3">
        <h1 className="text-4xl md:text-6xl font-bold">Tic Tac F{ hardcore ? "uc" : <span>
          <span className="text-enemy">*</span>
          <span className="text-ally">&deg;</span>
        </span>}k You</h1>
        <p className="max-w-2/3 md:max-w-100 text-center">
          <span className="text-ally underline">YOU</span>{" "}
          <span className="text-neutral">vs a</span>{" "}
          <span className="text-enemy underline">snarky cheating AI</span> in a
          classic head on match of Tic-Tac-Toe... Because, why { hardcore && "the fuck" } not?
        </p>
        <div className="flex gap-4">
        <Button size="lg" variant="neutral" asChild className="text-2xl">
          <Link href="/play">Play, if you dare</Link>
        </Button>
        <Button size="lg" className="text-2xl" variant="enemy" onClick={toggleHardcoreMode}>{!session && "login to "} enable swearing</Button>
        </div>
      </section>
    </main>
  );
}
