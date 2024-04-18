import { db } from "@/db";
import { publicProcedure, router } from "..";
import { SignUpValidator } from "../validators/user/sign-up-validator";
import { SignInValidator } from "../validators/user/sign-in-validator";
import { generateId } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import logger from "@/lib/logger";
import { SIGNUP_FAILED, USER_NOT_EXISTS } from "@/constants/literals";
import { sign } from "@/lib/jwt";

export const userRouter = router({
  signUp: publicProcedure
    .input(SignUpValidator)
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await db.user.create({
          data: {
            phone: input.phone,
            email: input.email,
            password: input.password,
            name: input.phone,
            uid: generateId(),
            isEmailVerified: false,
            token: sign(input.email, input.phone),
            refreshToken: sign(input.email, input.phone),
            verifyToken: sign(input.email, input.phone),
          },
        });
        logger.info(`User SignUp success: ${user}`);
        return {
          phone: input.phone,
          email: input.email,
          token: user.token,
          refreshToken: user.refreshToken,
        };
      } catch (error) {
        logger.error(`User SignUp error: ${error}`);
        throw new TRPCError({ code: "CONFLICT", message: SIGNUP_FAILED });
      }
    }),
  signIn: publicProcedure
    .input(SignInValidator)
    .mutation(async ({ input, ctx }) => {
      const user = await db.user.findFirst({
        where: {
          OR: [{ phone: input.account }, { email: input.account }],
          password: input.password,
        },
      });
      logger.info(`User SignIn: ${user}`);
      if (user === null) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: USER_NOT_EXISTS });
      } else {
        const newToken = sign(user.email, user.phone);
        const newRefreshToken = sign(user.email, user.phone);
        await db.user.update({
          where: {
            uid: user.uid,
          },
          data: {
            token: newToken,
            refreshToken: newRefreshToken,
          },
        });
        return {
          phone: user.phone,
          email: user.email,
          token: newToken,
          refreshToken: newRefreshToken,
        };
      }
    }),
});
