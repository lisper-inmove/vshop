"use client";

import React, { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { trpcClient } from "./client";
import useUser from "@/user/use-user";

export const Provider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const url = `${process.env.NEXT_PUBLIC_TRPC_URL!}/api/trpc`;

  const { getUserinfo } = useUser();

  const client = trpcClient.createClient({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: url,
        headers() {
          const token = getUserinfo()?.token;
          return {
            Authorization: token === "" ? "" : `Bearer ${getUserinfo()?.token}`,
          };
        },
      }),
    ],
  });

  return (
    <trpcClient.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpcClient.Provider>
  );
};
