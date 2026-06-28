import { z } from "zod";

import { TaskIdSchema } from "../schemas.js";
import { db } from "../sensors/db/index.js";
import { publicProcedure, router } from "./_trpc.js";

export const appRouter = router({
  health: publicProcedure.query(() => ({
    ok: true,
    service: "tasknote-server",
  })),

  tasks: router({
    list: publicProcedure.query(async ({ ctx }) => {
      return await db.getTasks({ userId: ctx.userId });
    }),

    create: publicProcedure
      .input(
        z.object({
          title: z.string().trim().min(1).max(200),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        return await db.createTask({ title: input.title, userId: ctx.userId });
      }),

    setDone: publicProcedure
      .input(
        z.object({
          id: TaskIdSchema,
          done: z.boolean(),
        }),
      )
      .mutation(async ({ input }) => {
        return await db.setDone({ id: input.id, done: input.done });
      }),
  }),
});

export type AppRouter = typeof appRouter;
