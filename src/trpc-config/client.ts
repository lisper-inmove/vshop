import { AppRouter } from "@/trpc-config/router";
import { createTRPCReact } from "@trpc/react-query";

// use client
export const trpcClient = createTRPCReact<AppRouter>({});
