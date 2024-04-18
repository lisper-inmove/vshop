import { z } from "zod";

export const SignInValidator = z.object({
  account: z.string().min(1),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export type TSignInValidator = z.infer<typeof SignInValidator>;
