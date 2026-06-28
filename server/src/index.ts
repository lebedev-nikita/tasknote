import { serve } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { createContext } from "./api/_context.js";
import { appRouter } from "./api/trpc.js";
import { env } from "./env.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.get("/", (c) =>
  c.json({
    ok: true,
    trpc: "/trpc",
  }),
);

app.all("/trpc/*", (c) =>
  fetchRequestHandler({
    endpoint: "/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  }),
);

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server ready at http://localhost:${info.port}`);
  },
);
