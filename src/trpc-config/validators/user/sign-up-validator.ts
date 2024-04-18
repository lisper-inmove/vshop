import { z } from "zod";

export const SignUpValidator = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^1\d{10}$/, "Invalid phone number format"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export type TSignUpValidator = z.infer<typeof SignUpValidator>;
