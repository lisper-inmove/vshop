import { z } from "zod";

export const CreateCommodityValidator = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrls: z.array(z.string()),
  status: z.string(),
  cover: z.string(),
  essay: z.string(),
  labels: z.string(),
  link: z.string(),
});

export type TCreateCommodityValidator = z.infer<
  typeof CreateCommodityValidator
>;
