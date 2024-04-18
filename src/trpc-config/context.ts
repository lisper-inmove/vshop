import { User } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";

export interface ContextType {
  version: string;
  request?: Request;
  authorization: string;
}

export const createContext = async (req?: Request) => {
  return {
    authorization: req?.headers.get("authorization"),
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
