# 3025 TTRPG

A web companion for a tabletop role-playing game set in the year 3025. Each
player gets a single character sheet with stats, vitals, psychology,
connections, inventory, and skill trees; gamemasters and admins can view every
sheet at the table. Live at <https://3025.jannisblossey.com>.

## Stack

- **Framework** — [Next.js 16](https://nextjs.org) (App Router, `standalone`
  output) on React 19
- **Database** — PostgreSQL via [Neon](https://neon.tech) using the serverless
  HTTP driver; [Drizzle ORM](https://orm.drizzle.team) for schema and
  migrations
- **Auth** — [better-auth](https://www.better-auth.com) with passkey, username,
  and admin plugins; email/password sign-up is **disabled** (users are
  provisioned by an admin)
- **UI** — Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com) (`base-nova`
  style) with a custom HUD-themed component set under
  [src/components/thegridcn/](src/components/thegridcn/), Lucide icons
- **State & validation** — Immer + `use-immer`, [Zod v4](https://zod.dev)
- **Tooling** — [oxlint](https://oxc.rs) + [oxfmt](https://oxc.rs), Vitest +
  Testing Library + happy-dom, [pnpm](https://pnpm.io) 10, Node 22

## Project layout

```text
src/
  app/
    actions/         Server actions (character CRUD)
    admin/           Admin console (user management, sessions, impersonation)
    api/auth/        better-auth route handler
    api/health/      Liveness/readiness endpoint
    account/         Self-service account page
    character/[id]/  Character sheet page
    login/           Sign-in (password + passkey)
  components/
    character-sheet/ Sheet sections (stats, vitals, psychology, …)
    thegridcn/       HUD primitives (gauge, frame, divider, rating, …)
    ui/              shadcn primitives
  db/                Drizzle schema (auth + character tables)
  hooks/             use-auto-save and friends
  lib/               auth, db, validation, role helpers
  proxy.ts           Next.js middleware: redirects unauthenticated traffic
drizzle/             Generated SQL migrations
k8s/                 Deployment manifests (Traefik + cert-manager)
```

The character data model lives in [src/types/character.ts](src/types/character.ts)
(Zod schema + TypeScript types + default-data factory). It is stored as a
single `jsonb` column on the `character` table, with a unique index on
`user_id` enforcing one character per user.

## Getting started

### Prerequisites

- Node 22 (`~22.22`) and pnpm 10 (`10.30.1`) — pinned in
  [.prototools](.prototools); [proto](https://moonrepo.dev/proto) will install
  the right versions automatically.
- A PostgreSQL database. The simplest path is `docker compose up`, which boots
  a [Neon Local](https://neon.com/docs/local/neon-local) proxy that mirrors a
  Neon branch on `localhost:5432`. You'll need a Neon project and API key for
  this — set `NEON_API_KEY` and `NEON_PROJECT_ID` in `.env`.

### First-time setup

```bash
pnpm install
cp .env.example .env             # then fill in the values below
docker compose up -d             # starts Neon Local on :5432
pnpm drizzle-kit migrate         # apply migrations
pnpm dev                         # http://localhost:3000
```

Required environment variables (see [.env.example](.env.example)):

| Variable                           | Purpose                                                          |
| ---------------------------------- | ---------------------------------------------------------------- |
| `DATABASE_URL`                     | Postgres connection string                                       |
| `BETTER_AUTH_SECRET`               | Session-signing secret — generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL`                  | Public URL of the app (e.g. `http://localhost:3000`)             |
| `NEXT_PUBLIC_BETTER_AUTH_URL`      | Same value, exposed to the browser                               |
| `NEON_API_KEY` / `NEON_PROJECT_ID` | Only needed when using `docker-compose.yml` for Neon Local       |

## Common commands

```bash
pnpm dev              # next dev
pnpm build            # next build (standalone)
pnpm start            # next start (production)

pnpm lint             # oxlint
pnpm lint:fix         # oxlint --fix
pnpm format           # oxfmt
pnpm format:check     # oxfmt --check
pnpm typecheck        # tsc --noEmit

pnpm test             # vitest run
pnpm test:watch       # vitest

pnpm drizzle-kit generate     # create a new migration from schema diff
pnpm drizzle-kit migrate      # apply pending migrations
pnpm drizzle-kit studio       # browse the database
```

## Roles

Three roles are recognised (see [src/lib/roles.ts](src/lib/roles.ts)):

- `user` — sees only their own character.
- `gamemaster` — privileged; can view every character and use the table-side
  character nav.
- `admin` — everything `gamemaster` can do, plus user management and
  impersonation via the better-auth admin plugin.

`gamemaster` and `admin` are treated equivalently for read access in
[character-actions.ts](src/app/actions/character-actions.ts); admin-only
operations (creating users, banning, impersonating) are gated separately
inside [src/app/admin/](src/app/admin/).

## Deployment

The repository builds a `linux/arm64` image from
[Dockerfile](Dockerfile) using
Docker DHI Node base images and Next.js
standalone output. CI ([.github/workflows/ci.yml](.github/workflows/ci.yml))
runs lint, typecheck, tests, `next build`, and a Docker build on every PR; on
push to `main`, [deploy.yml](.github/workflows/deploy.yml) pushes the image to
`ghcr.io/jblossey/3025-ttrpg` and `kubectl set image`s the deployment in the
`3025-ttrpg` namespace. Manifests for the deployment, service, ingress
(Traefik + cert-manager), and namespace live under [k8s/](k8s/). The container
exposes a health check at `/api/health` for the readiness, liveness, and
startup probes.
