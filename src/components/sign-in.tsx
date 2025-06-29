import { signIn } from "@/lib/auth"
import { Button } from "./ui/button"
import SlackIcon from "@/icons/slack.svg";
import Image from "next/image";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("slack")
      }}
    >
      <Button size="lg" className="text-2xl pb-0.5" type="submit">
        <Image alt="Slack Technologies Icon" width={24} src={SlackIcon}/> Sign in with Slack
      </Button>
    </form>
  )
}
