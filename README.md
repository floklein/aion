# aion

Aion is an authenticated AI desktop app backed by a Next.js server. It combines an Electron + React client, Better Auth, PostgreSQL/Drizzle, multi-model chat, and optional web search in a single Turborepo workspace.

## What It Does

- Chat from a desktop UI built with Electron, React 19, and TanStack Router
- Switch between models such as GPT-5, Claude Sonnet 4, and Gemini 2.5 Flash
- Route web-enabled queries through Perplexity Sonar
- Handle sign-up and sign-in with Better Auth
- Persist auth data in PostgreSQL through Drizzle ORM
- Expose a server-side chat API from a Next.js app
- Manage local MCP server config from the app settings screen

## Monorepo Layout

```text
apps/
├── desktop/  # Electron renderer + desktop shell
└── server/   # Next.js API, auth, and database layer
```

## Requirements

- Node.js 20+
- pnpm 10+
- Docker, if you want to run PostgreSQL locally with the included compose file

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create local env files from the examples:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/desktop/.env.example apps/desktop/.env
```

3. Fill in the required values:

- `apps/server/.env`
  - `DATABASE_URL`
  - `CORS_ORIGIN`
  - `BETTER_AUTH_SECRET`
  - `BETTER_AUTH_URL`
  - `AI_GATEWAY_API_KEY`
- `apps/desktop/.env`
  - `VITE_SERVER_URL`

4. Start PostgreSQL:

```bash
pnpm run db:start
```

5. Push the database schema:

```bash
pnpm run db:push
```

6. Start the workspace:

```bash
pnpm run dev
```

By default, the server runs on `http://localhost:3000`. Point `VITE_SERVER_URL` at that server for the desktop app.

## Useful Commands

- `pnpm run dev` runs the whole workspace
- `pnpm run dev:desktop` starts only the Electron app
- `pnpm run dev:server` starts only the Next.js server
- `pnpm run build` builds all apps
- `pnpm run check-types` runs TypeScript checks across the monorepo
- `pnpm run check` runs Biome checks and formatting
- `pnpm run db:start` starts PostgreSQL with Docker Compose
- `pnpm run db:stop` stops the database container
- `pnpm run db:down` stops the database container and removes resources
- `pnpm run db:push` pushes the current Drizzle schema
- `pnpm run db:studio` opens Drizzle Studio

## Stack

- Electron Forge
- React 19
- TanStack Router
- Next.js 15
- Better Auth
- Drizzle ORM
- PostgreSQL
- AI SDK
- Turborepo
- Tailwind CSS
- Biome
