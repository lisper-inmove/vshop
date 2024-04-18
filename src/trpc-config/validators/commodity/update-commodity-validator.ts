import { z } from "zod";

export const UpdateCommodityValidator = z.object({
  uid: z.string(),
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

export type TUpdateCommodityValidator = z.infer<
  typeof UpdateCommodityValidator
>;
