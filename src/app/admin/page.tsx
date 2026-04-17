import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { HUDFrame } from "@/components/thegridcn/hud-frame";
import { auth } from "@/lib/auth";

import { AdminActions } from "./admin-actions";
import { CreateUserForm } from "./create-user-form";
import { UserFilters, UserPagination } from "./user-filters";

const PAGE_SIZE = 20;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const params = await searchParams;
  const search = params.search ?? "";
  const searchField = (params.field as "name" | "email") || "name";
  const offset = Number(params.offset ?? "0");
  const sortBy = params.sort ?? "createdAt";
  const sortDirection = (params.dir as "asc" | "desc") ?? "desc";

  const query: Record<string, unknown> = {
    limit: PAGE_SIZE,
    offset,
    sortBy,
    sortDirection,
  };

  if (search) {
    query.searchValue = search;
    query.searchField = searchField;
    query.searchOperator = "contains";
  }

  const result = await auth.api.listUsers({
    headers: await headers(),
    query,
  });

  const users = result.users as Array<
    (typeof result.users)[number] & {
      username?: string | null;
      banReason?: string | null;
    }
  >;
  const total = result.total ?? users.length;

  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="mx-auto max-w-5xl space-y-4 md:space-y-6">
        <HUDFrame label="Admin Console">
          <div className="space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-primary glow-text text-lg font-bold tracking-wider md:text-xl">
                User Management
              </h1>
              <p className="text-muted-foreground font-mono text-[9px] tracking-widest uppercase">
                Signed in as {session.user.name}
              </p>
            </div>

            {/* Search & Create */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
              <UserFilters />
              <CreateUserForm />
            </div>

            {/* User table - desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-primary/20 text-muted-foreground border-b text-left text-[9px] tracking-widest uppercase">
                    <th className="pr-4 pb-2">Name</th>
                    <th className="pr-4 pb-2">Username</th>
                    <th className="pr-4 pb-2">Email</th>
                    <th className="pr-4 pb-2">Role</th>
                    <th className="pr-4 pb-2">Status</th>
                    <th className="pr-4 pb-2">Created</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-primary/10 text-foreground/80 border-b align-top"
                    >
                      <td className="py-2 pr-4">{user.name}</td>
                      <td className="text-foreground/50 py-2 pr-4">
                        {user.username ?? "—"}
                      </td>
                      <td className="text-foreground/50 py-2 pr-4">
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
                          <span className="text-destructive">
                            Banned
                            {user.banReason && (
                              <span className="text-destructive/60 block text-[9px]">
                                {user.banReason}
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-green-500">Active</span>
                        )}
                      </td>
                      <td className="text-foreground/40 py-2 pr-4 text-[10px]">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2">
                        <AdminActions
                          userId={user.id}
                          userName={user.name}
                          userEmail={user.email}
                          isBanned={user.banned ?? false}
                          role={user.role ?? "user"}
                          isCurrentUser={user.id === session.user.id}
                        />
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-foreground/40 py-8 text-center"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* User cards - mobile */}
            <div className="space-y-3 md:hidden">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border-primary/10 space-y-2 rounded-md border p-3 font-mono text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-foreground/80 truncate font-bold">
                        {user.name}
                      </p>
                      {user.username && (
                        <p className="text-foreground/50 truncate text-[10px]">
                          @{user.username}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={
                          user.role === "admin"
                            ? "text-primary text-[10px]"
                            : "text-foreground/50 text-[10px]"
                        }
                      >
                        {user.role ?? "user"}
                      </span>
                      {user.banned ? (
                        <span className="text-destructive text-[10px]">
                          Banned
                        </span>
                      ) : (
                        <span className="text-[10px] text-green-500">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-foreground/50 truncate text-[10px]">
                    {user.email}
                  </p>
                  <AdminActions
                    userId={user.id}
                    userName={user.name}
                    userEmail={user.email}
                    isBanned={user.banned ?? false}
                    role={user.role ?? "user"}
                    isCurrentUser={user.id === session.user.id}
                  />
                </div>
              ))}
              {users.length === 0 && (
                <p className="text-foreground/40 py-8 text-center font-mono text-xs">
                  No users found
                </p>
              )}
            </div>

            {/* Pagination */}
            <UserPagination total={total} limit={PAGE_SIZE} offset={offset} />
          </div>
        </HUDFrame>
      </div>
    </div>
  );
}
