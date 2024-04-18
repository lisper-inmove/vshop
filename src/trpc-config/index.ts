import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { Context } from "./context";
import { db } from "@/db";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
  const { authorization } = ctx;
  console.log(authorization);
  if (authorization === null || authorization === "") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Token is missing" });
  }
  const token = authorization!.split(" ")[1];
  const user = await db.user.findFirst({
    where: {
      token: token,
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Token is missing or expired",
    });
  }
  return next({
    ctx: {
      user: user,
    },
  });
});

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthed);
