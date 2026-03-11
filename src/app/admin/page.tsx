import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HUDFrame } from "@/components/ui/hud-frame";
import { AdminActions } from "./admin-actions";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const users = await auth.api.listUsers({
    headers: await headers(),
    query: { limit: 100 },
  });

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <HUDFrame label="Admin Console">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold tracking-wider text-primary glow-text">
                User Management
              </h1>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Signed in as {session.user.name}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b border-primary/20 text-left text-[9px] uppercase tracking-widest text-muted-foreground">
                    <th className="pb-2 pr-4">Name</th>
                    <th className="pb-2 pr-4">Email</th>
                    <th className="pb-2 pr-4">Role</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-primary/10 text-foreground/80"
                    >
                      <td className="py-2 pr-4">{user.name}</td>
                      <td className="py-2 pr-4 text-foreground/50">
                        {user.email}
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className={
                            user.role === "admin"
                              ? "text-primary"
                              : "text-foreground/50"
                          }
                        >
                          {user.role ?? "user"}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        {user.banned ? (
                          <span className="text-destructive">Banned</span>
                        ) : (
                          <span className="text-green-500">Active</span>
                        )}
                      </td>
                      <td className="py-2">
                        <AdminActions
                          userId={user.id}
                          isBanned={user.banned ?? false}
                          role={user.role ?? "user"}
                          isCurrentUser={user.id === session.user.id}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </HUDFrame>
      </div>
    </div>
  );
}
