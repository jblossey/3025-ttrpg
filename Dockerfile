FROM dhi.io/node:22.22-dev@sha256:4a3bde9f277769fc766383a68c576a13615de3e4d47555b474a198bb5436b664 AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Provide placeholder values so Next.js can compile routes that reference env vars at build time.
# Real values are supplied at runtime.
ENV BETTER_AUTH_URL=http://placeholder
ENV DATABASE_URL=postgres://placeholder:placeholder@placeholder:5432/placeholder
ENV BETTER_AUTH_SECRET=placeholder

RUN pnpm build

FROM dhi.io/node:22.22@sha256:81b6e35245e1a25b434ac400b162e70e14065d6eb42427a5ff527ec5e48e6a21
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# DHI runtime already runs as nonroot (uid 65532), no need to set USER
EXPOSE 3000
CMD ["node", "server.js"]