import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./_context.js";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    console.error(error.stack ?? error.message);
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
