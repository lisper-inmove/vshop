"use client";
// 商品详情页

import ImageSlider from "@/components/ImageSlider";
import { trpcClient } from "@/trpc-config/client";
import { Loader2 } from "lucide-react";
import "./style.css";
import { formatDate } from "@/lib/date-util";
import { PaymentQrcode } from "@/components/PaymentQrcode";

interface PageProps {
  params: {
    id: string;
  };
}

const CommodityDetail = ({ params }: PageProps) => {
  const { data, isLoading, error } =
    trpcClient.commodityRouter.getById.useQuery({
      id: params.id,
    });

  if (error) {
    return (
      <>
        <div className="flex items-center justify-center text-5xl mt-20">
          Something is wrong!
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center text-5xl mt-20">
          <Loader2 className="animate-spin w-24 h-24" />
        </div>
      </>
    );
  }

  const commodity = data.commodity;

  if (commodity === null) {
    return (
      <>
        <div className="flex items-center justify-center text-5xl mt-20">
          Something is wrong!
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex h-[90%] w-[100%] items-start justify-center gap-10 p-10 mt-20">
        <div className="flex items-center justify-center relative h-full w-1/2 rounded-3xl">
          <div className="relative h-2/3 w-2/3 content-center mx-auto">
            <ImageSlider urls={commodity.imageUrls} />
          </div>
        </div>
        <div className="flex flex-col justify-between h-full w-1/2 overflow-auto">
          <div>
            <div className="text-4xl text-teal-400 dark:text-cyan-400">
              {commodity.name}
            </div>
            <div className="text-lg text-muted-foreground indent-4 mt-5">
              {commodity.description}
            </div>
            <div className="text-lg text-muted-foreground indent-4">
              {formatDate(commodity.createdAt)}
            </div>
            <div className="text-xl dark:text-white/95 text-black/95 mt-10 w-2/3 indent-8">
              {commodity.essay}
            </div>
            <div className="flex gap-5 text-lg mt-10">
              {commodity.labels.split(",").map((label, index) => {
                return (
                  <div
                    key={`${label}-${index}`}
                    className="text-red-500 dark:text-red-300"
                  >
                    #{label}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 cursor-pointer pr-4 text-cyan-900 dark:text-cyan-400">
            <PaymentQrcode commodity={commodity} /> ￥{commodity.price / 100}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommodityDetail;
