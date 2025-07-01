import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="flex flex-col items-center gap-3">
        <h1 className="text-4xl md:text-6xl font-bold">Tic Tac Fuck You</h1>
        <p className="max-w-2/3 md:max-w-100 text-center">
          <span className="text-ally underline">YOU</span>{" "}
          <span className="text-neutral">vs a</span>{" "}
          <span className="text-enemy underline">snarky cheating AI</span> in a
          classic head on match of Tic-Tac-Toe... Because, why the fuck not?
        </p>
        <Button size="lg" variant="neutral" asChild className="text-2xl">
          <Link href="/play">Play, if you dare</Link>
        </Button>
      </section>
    </main>
  );
}
