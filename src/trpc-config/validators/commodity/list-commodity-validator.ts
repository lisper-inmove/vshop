import { z } from "zod";

export const ListCommodityValidator = z.object({
  lastCondition: z.string().optional(),
  size: z.number(),
});

export type TListCommodityValidator = z.infer<typeof ListCommodityValidator>;
