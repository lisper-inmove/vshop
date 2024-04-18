import { db } from "@/db";
import logger from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url!);
  const timestamp = parseInt(searchParams.get("lastCondition")!, 10);
  const date = new Date(timestamp);
  const commodities = await db.commodity.findMany({
    where: {
      createdAt: {
        lt: date,
      },
    },
    orderBy: [{ createdAt: "desc" }],
    take: searchParams.size,
  });
  logger.info(date);
  logger.info(commodities.length);
  return NextResponse.json({ code: "success", commodities: commodities });
};
