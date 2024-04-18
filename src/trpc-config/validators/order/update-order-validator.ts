import { z } from "zod";

export const FinishOrderValidator = z.object({
  orderId: z.string(),
});

export type TFinishOrderValidator = z.infer<typeof FinishOrderValidator>;
