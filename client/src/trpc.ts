import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import type { AppRouter } from "@tasknote/server";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

export function createQueryClient() {
  return new QueryClient();
}

export function createTrpcClient() {
  return createTRPCClient<AppRouter>({
    links: [
      httpLink({
        url: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/trpc",
        transformer: superjson,
      }),
    ],
  });
}
