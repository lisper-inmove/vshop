import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "..";
import { CreateOrderValidator } from "../validators/order/create-order-validator";
import { TRPCError } from "@trpc/server";
import { generateId } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { warn } from "console";
import { QueryUserOrderValidator } from "../validators/order/query-user-order-validator";
import { FinishOrderValidator } from "../validators/order/update-order-validator";

export const orderRouter = router({
  create: privateProcedure
    .input(CreateOrderValidator)
    .mutation(async ({ input, ctx }) => {
      const commodity = await db.commodity.findFirst({
        where: {
          id: input.commodityId,
        },
      });
      if (!commodity) {
        throw new TRPCError({ code: "NOT_FOUND", message: "商品不存在" });
      }
      const user = await db.user.findFirst({
        where: {
          token: input.token,
        },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "用户不存在" });
      }
      const order = await db.order.create({
        data: {
          uid: generateId(),
          status: OrderStatus.CREATED,
          userId: user.uid,
          commodityId: commodity.uid,
          payFee: commodity.price,
          downloadLink: commodity.link,
        },
      });
      return { code: "success", order: order };
    }),
  userOrders: privateProcedure
    .input(QueryUserOrderValidator)
    .query(async ({ input, ctx }) => {
      const { user } = ctx;
      const page: number = input.page || 1;
      const size: number = input.size || 20;
      const orders = await db.order.findMany({
        where: {
          userId: user.uid,
          status: "SUCCESS",
        },
        skip: (page - 1) * size,
        take: size,
        orderBy: [{ createdAt: "desc" }],
      });
      return { code: "success", orders: orders };
    }),
  finishOrder: privateProcedure
    .input(FinishOrderValidator)
    .mutation(async ({ input, ctx }) => {
      const orderId = input.orderId;
      const order = await db.order.findFirst({
        where: {
          uid: orderId,
        },
      });
      console.log("finish order");
      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }
      order.status = "SUCCESS";
      await db.order.update({
        where: {
          uid: order.uid,
        },
        data: {
          status: "SUCCESS",
        },
      });
      return { code: "success" };
    }),
});
