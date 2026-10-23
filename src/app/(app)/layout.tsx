import { AppShell } from "@/components/app-shell/app-shell";
import { requireUser } from "@/lib/guards";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <AppShell
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      }}
    >
      {children}
    </AppShell>
  );
}
