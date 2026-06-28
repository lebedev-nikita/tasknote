import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import TaskScreen from "./TaskScreen";
import { createQueryClient, createTrpcClient, TRPCProvider } from "./trpc";

export function App() {
  const [queryClient] = useState(createQueryClient);
  const [trpcClient] = useState(createTrpcClient);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <TaskScreen />
        </TRPCProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
