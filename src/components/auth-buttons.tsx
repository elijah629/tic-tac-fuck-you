import { signIn, signOut } from "@/lib/auth"
import { Button } from "./ui/button"
import SlackIcon from "@/icons/slack.svg";
import Image from "next/image";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("slack")
      }}
    >
      <Button size="lg" className="text-2xl pb-0.5 hidden md:flex" type="submit">
        <Image alt="Slack Technologies Icon" width={24} src={SlackIcon}/> Sign in with Slack
      </Button>
      <Button size="icon" className="text-2xl p-2 flex md:hidden" type="submit">
        <Image alt="Slack Technologies Icon" width={24} src={SlackIcon}/>
      </Button>
    </form>
  )
}

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <Button size="lg" className="text-2xl pb-0.5" type="submit">Sign Out</Button>
    </form>
  )
}
