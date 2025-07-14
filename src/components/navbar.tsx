import Link from "next/link";
import { AuthButton } from "./auth-buttons";

export async function Navbar({ logo }: { logo: string }) {
  return (
    <div className="flex items-center p-4">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <span className="hover:animate-spin text-4xl">{logo}</span>
      </Link>
      <nav className="flex items-center ml-auto p-4 gap-4 xl:gap-6">
        <Link
          href="/how-to-play"
          className={"transition-colors hover:text-foreground/80"}
        >
          How to Play?
        </Link>

        <Link
          href="/play"
          className={"transition-colors hover:text-foreground/80"}
        >
          Play
        </Link>
        <Link
          href="/leaderboard"
          className={"transition-colors hover:text-foreground/80"}
        >
          Leaderboard
        </Link>
      </nav>
      <AuthButton />
    </div>
  );
}
