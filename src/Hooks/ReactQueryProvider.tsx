"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import type { DehydratedState } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 4,
      refetchOnWindowFocus: false,
    },
  },
});

export function ReactQueryProvider({
  children,
  dehydratedState,
}: {
  children: ReactNode;
  dehydratedState?: DehydratedState | null;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
