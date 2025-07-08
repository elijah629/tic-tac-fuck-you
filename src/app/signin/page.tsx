import { AuthButton } from "@/components/auth-buttons";

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl: string | undefined }>;
}) {
  const params = await props.searchParams;

  return (
    <main className="h-full w-full flex flex-col items-center justify-center gap-4">
      <h1 className="text-center text-4xl">Sign in to play!</h1>
      <AuthButton redirect={params.callbackUrl ?? ""} />
    </main>
  );
}
