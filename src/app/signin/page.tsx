import { AuthButton } from "@/components/auth-buttons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl: string | undefined }>;
}) {
  const params = await props.searchParams;

  return (
    <main className="h-full w-full flex flex-col items-center justify-center gap-4">
      <h1 className="text-center text-4xl">Sign in to play!</h1>
      <AuthButton redirect={params.callbackUrl ?? ""} />
      <Link
        href={params.callbackUrl ? params.callbackUrl + "?free" : "/play/?free"}
      >
        <Button variant="secondary" size="lg" className="text-2xl">
          Continue as free user
        </Button>
      </Link>
    </main>
  );
}
