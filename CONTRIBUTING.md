# Contributing

Thanks for taking a look. This is a small project for a single tabletop game,
but PRs and issues are welcome.

## Development setup

See the [Getting started](README.md#getting-started) section of the README for
prerequisites, environment variables, and the local database. In short:

```bash
pnpm install
cp .env.example .env             # fill in values
docker compose up -d             # Neon Local on :5432
pnpm drizzle-kit migrate
pnpm dev
```

You can either ask me to invite you to the Neon project or simply replace the neon-local part with a normal Postgresql DB in docker compose.

Node 22 and pnpm 10 are pinned in [.prototools](.prototools); if you use
[proto](https://moonrepo.dev/proto) the correct versions will be selected
automatically when you execute `proto install`.

## Workflow

1. Branch or fork off `main`. Pick a short, descriptive name (e.g.
   `fix-skill-tree-overflow`, `add-encumbrance`).
2. Keep changes focused — one logical change per PR. Prefer several small PRs
   over one large one.
3. Before pushing, run the same checks CI does:
   ```bash
   pnpm lint
   pnpm format:check
   pnpm typecheck
   pnpm test
   pnpm build
   ```
   `pnpm lint:fix` and `pnpm format` will fix most autofixable issues.
4. Open a PR against `main`. The CI workflow
   ([.github/workflows/ci.yml](.github/workflows/ci.yml)) must pass before
   merge. Merging `main` triggers a Docker build and Kubernetes rollout, so
   please don't merge unless you mean it.

## Commit messages

Commits use conventional-commit-ish prefixes — look at `git log` for the
shape. Common prefixes:

- `feat(scope): …` — user-visible feature
- `fix(scope): …` — bug fix
- `chore(scope): …` — tooling, deps, config (Dependabot uses this)
- `refactor(scope): …` — non-behavioural change
- `test(scope): …` — tests only
- `docs(scope): …` — documentation only

Keep the subject line under ~70 characters; put detail in the body.

## Code style

- **Formatting and linting** are enforced by [oxfmt](.oxfmtrc.json) and
  [oxlint](.oxlintrc.json). Run `pnpm format` and `pnpm lint:fix` before
  pushing — CI will reject otherwise.
- **TypeScript is `strict`** ([tsconfig.json](tsconfig.json)). Avoid `any`;
  reach for Zod schemas at trust boundaries (server actions, API routes, form
  input) and let TypeScript infer the rest.
- **Imports** are auto-sorted by oxfmt. Use the `@/` path alias for everything
  under `src/`.
- **Server vs client components** — keep the boundary explicit. Database
  access lives in `"use server"` files (see
  [src/app/actions/](src/app/actions/)) or route handlers under
  [src/app/api/](src/app/api/); never import [src/lib/db.ts](src/lib/db.ts)
  from a client component.
- **Auth checks belong in server actions and route handlers**, not the
  middleware. [src/proxy.ts](src/proxy.ts) only redirects unauthenticated
  traffic to `/login`; ownership and role gating happen alongside the
  database call (the pattern in
  [character-actions.ts](src/app/actions/character-actions.ts) is the model:
  `getSession()` first, then check `userId` or `isPrivilegedRole`).
- **State** — prefer Immer (`use-immer`) for character-sheet edits; it keeps
  deeply nested updates readable.
- **Comments** — only add one when the _why_ is non-obvious. Don't restate
  what the code does.

## Tests

- Tests live next to the code as `*.test.ts` / `*.test.tsx` and run under
  [Vitest](vitest.config.ts) with happy-dom and Testing Library.
- Cover validation logic, derived values (e.g.
  [`computeMaxHp`](src/types/character.ts#L73)), and any non-trivial reducer
  or component behaviour.
- Server actions that touch the database aren't unit-tested in this repo;
  exercise them by hand against the local Neon Local instance.

## Database changes

1. Edit [src/db/schema.ts](src/db/schema.ts) (and/or
   [src/db/auth-schema.ts](src/db/auth-schema.ts) — note that the latter
   mirrors better-auth's expected tables; only edit it if you're adding
   columns or indexes that better-auth itself doesn't manage).
2. Generate a migration:
   ```bash
   pnpm drizzle-kit generate
   ```
3. Inspect the generated SQL under [drizzle/](drizzle/) and commit it
   alongside the schema change.
4. Apply locally:
   ```bash
   pnpm drizzle-kit migrate
   ```

Migrations are not yet applied automatically in production — running them is a
manual step against the Neon project. Coordinate before merging schema
changes.

## Adding shadcn / thegridcn components

The repo is wired up for both registries (see [components.json](components.json)).
To add a stock shadcn component:

```bash
pnpm dlx shadcn@latest add <component>
```

For HUD primitives from `thegridcn`, use the namespaced registry:

```bash
pnpm dlx shadcn@latest add @thegridcn/<component>
```

## Reporting issues

Open a GitHub issue with:

- What you were doing
- What you expected
- What happened (browser console + server log if relevant)
- Browser / OS, and whether it reproduces locally

For security-sensitive reports, please email Jannis directly rather than
opening a public issue.
