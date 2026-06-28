import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { UserIdSchema } from "../schemas.js";

export async function createContext(_opts: FetchCreateContextFnOptions) {
  return { userId: UserIdSchema.parse(1) };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
