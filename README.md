# Tasknote

Hono + tRPC + PostgreSQL server with an Expo React Native client.

## Setup

```sh
pnpm install
cp .env.example .env
cp client/.env.example client/.env
```

Set `.env`:

```dotenv
DATABASE_URL=postgres://postgres:postgres@localhost:5432/tasknote
PORT=3000
CLIENT_ORIGIN=http://localhost:8081
```

Apply the schema with the same URL:

```sh
psql "postgres://postgres:postgres@localhost:5432/tasknote" -f db/schema.sql
```

```sh
pnpm dev
```
