import { db } from "@/db";
import logger from "@/lib/logger";
import { TRPCError } from "@trpc/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url!);
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "20");
  const token = req.headers.get("Authorization");
  if (!token) {
    throw new TRPCError({ code: "FORBIDDEN", message: "No Authorization" });
  }
  const user = await db.user.findFirst({
    where: {
      token: token.split(" ")[1],
    },
  });
  if (!user) {
    throw new TRPCError({ code: "FORBIDDEN", message: "No Authorization" });
  }
  const orders = await db.order.findMany({
    where: {
      userId: user.uid,
    },
    orderBy: [{ createdAt: "desc" }],
    skip: (page - 1) * size,
    take: size,
  });
  const total = await db.order.count({
    where: {
      userId: user.uid,
    },
  });
  return NextResponse.json({
    code: 0,
    msg: "success",
    data: { orders: orders, total: total },
  });
};
