import { auth, unstable_update } from "@/lib/auth";

export default async function HardcoreToggle() {
  const session = await auth();

  const onToggle = async () => {
    "use server";

    const newMode = !((session?.user as unknown as { hardcore: boolean }).hardcore);
    await unstable_update({ user: { ["hardcore" as string]: newMode } });
  }
  return (
    <button onClick={onToggle}>
      {JSON.stringify(session)}
    </button>
  )
}
