import { z } from "zod";

export const QueryUserOrderValidator = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
});

export type TQueryUserOrderValidator = z.infer<typeof QueryUserOrderValidator>;
