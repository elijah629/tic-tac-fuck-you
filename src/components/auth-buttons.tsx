import { auth, signIn, signOut } from "@/lib/auth";
import { Button } from "./ui/button";
import SlackIcon from "@/images/slack.svg";
import Image from "next/image";

export async function AuthButton({ redirect }: { redirect?: string }) {
  const session = await auth();
  return session?.user?.name && session?.user?.image ? (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="group"
    >
      <Button size="icon" className="group-hover:hidden block" type="submit">
        <Image
          width={128}
          height={64}
          alt={session.user.name}
          src={session.user.image}
        />
      </Button>
      <Button
        size="lg"
        className="text-2xl pb-0.5 group-hover:block hidden"
        type="submit"
      >
        Sign Out
      </Button>
    </form>
  ) : (
    <form
      action={async () => {
        "use server";
        await signIn("slack", { redirectTo: redirect });
      }}
    >
      <Button
        size="lg"
        className="text-2xl pb-0.5 hidden md:flex"
        type="submit"
      >
        <Image alt="Slack Technologies Icon" width={24} src={SlackIcon} /> Sign
        in with Slack
      </Button>
      <Button
        size="icon"
        className="text-2xl scale-110 md:hidden flex"
        type="submit"
      >
        <Image alt="Slack Technologies Icon" width={24} src={SlackIcon} />
      </Button>
    </form>
  );
}
