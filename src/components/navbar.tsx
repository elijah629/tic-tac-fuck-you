import Link from "next/link";
import { SignInButton, SignOutButton } from "./auth-buttons";
import { auth } from "@/lib/auth";
import TTFULogo from "./logo";

export async function Navbar() {
  const session = await auth();

  const signed_out = !session?.user;

  return (
    <div className="flex items-center p-4">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <TTFULogo />
        {/*<Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>*/}
      </Link>
      <nav className="flex items-center ml-auto p-4 gap-4 xl:gap-6">
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
      {signed_out ? <SignInButton /> : <SignOutButton />}
    </div>
  );
}
