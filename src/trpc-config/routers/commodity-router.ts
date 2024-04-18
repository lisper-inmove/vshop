import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "..";
import { CreateCommodityValidator } from "../validators/commodity/create-commodity-validator";
import { generateId } from "@/lib/utils";
import { CommodityStatus } from "@prisma/client";
import { ListCommodityValidator } from "../validators/commodity/list-commodity-validator";
import logger from "@/lib/logger";
import { UpdateCommodityValidator } from "../validators/commodity/update-commodity-validator";
import { TRPCError } from "@trpc/server";
import { LTR_COMMODITY_NOT_FOUND } from "@/constants/literals";
import { z } from "zod";

const stringToStatusEnum = (value: string) => {
  if (value === "CREATED") return CommodityStatus.CREATED;
  if (value === "OUT_OF_STOCK") return CommodityStatus.OUT_OF_STOCK;
  if (value === "SELLING") return CommodityStatus.SELLING;
  if (value === "SOLD_OUT") return CommodityStatus.SOLD_OUT;
  return CommodityStatus.CREATED;
};

export const commodityRouter = router({
  create: publicProcedure
    .input(CreateCommodityValidator)
    .mutation(async ({ input, ctx }) => {
      const commodity = await db.commodity.create({
        data: {
          uid: generateId(),
          name: input.name,
          description: input.description,
          price: input.price,
          status: stringToStatusEnum(input.status),
          imageUrls: input.imageUrls,
          cover: input.cover,
          essay: input.essay,
          labels: input.labels,
          link: input.link,
        },
      });
      return commodity;
    }),
  update: publicProcedure
    .input(UpdateCommodityValidator)
    .mutation(async ({ input, ctx }) => {
      const commodity = await db.commodity.findFirst({
        where: {
          uid: input.uid,
        },
      });
      if (commodity === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: LTR_COMMODITY_NOT_FOUND,
        });
      }
      await db.commodity.update({
        where: {
          uid: input.uid,
        },
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          status: stringToStatusEnum(input.status),
          imageUrls: input.imageUrls,
          cover: input.cover,
          essay: input.essay,
          labels: input.labels,
          link: input.link,
        },
      });
      return commodity;
    }),
  listCommodities: publicProcedure
    .input(ListCommodityValidator)
    .query(async ({ input, ctx }) => {
      if (input.lastCondition === undefined) {
        input.lastCondition = new Date().getTime().toString();
      }
      const timestamp = parseInt(input.lastCondition, 10);
      const date = new Date(timestamp);
      const commodities = await db.commodity.findMany({
        where: {
          createdAt: {
            lt: date,
          },
        },
        orderBy: [{ createdAt: "desc" }],
        take: input.size,
      });
      logger.info(`listCommodities: ${commodities.length}`);
      return { code: "success", commodities: commodities };
    }),
  listCommoditiesDashboard: privateProcedure
    .input(ListCommodityValidator)
    .query(async ({ input, ctx }) => {
      if (input.lastCondition === undefined) {
        input.lastCondition = new Date().getTime().toString();
      }
      const { user } = ctx;
      if (user.uid !== "95f6d41e-0fc2-49ff-8b71-6bd88785d0f9") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot do this" });
      }
      const timestamp = parseInt(input.lastCondition, 10);
      const date = new Date(timestamp);
      const commodities = await db.commodity.findMany({
        where: {
          createdAt: {
            lt: date,
          },
        },
        orderBy: [{ createdAt: "desc" }],
        take: input.size,
      });
      logger.info(`listCommodities: ${commodities.length}`);
      return { code: "success", commodities: commodities };
    }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const commodity = await db.commodity.findFirst({
        where: {
          id: input.id,
        },
      });
      logger.info(`getCommodityById: ${commodity}`);
      return { code: "success", commodity: commodity };
    }),
});
