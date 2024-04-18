import { z } from "zod";

export const CreateOrderValidator = z.object({
  commodityId: z.string(),
  token: z.string(),
});

export type TCreateOrderValidator = z.infer<typeof CreateOrderValidator>;
