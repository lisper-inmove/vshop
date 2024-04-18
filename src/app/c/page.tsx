"use client";
import React, { useEffect, useState } from "react";
import { trpcClient } from "@/trpc-config/client";
import { Commodity } from "@prisma/client";
import { useInView } from "react-intersection-observer";
import { LoaderCircle } from "lucide-react";
import { MotionDiv } from "@/components/MotionDiv";
import { cn } from "@/lib/utils";
import Image from "next/image";
import "md-editor-rt/lib/preview.css";
import Link from "next/link";

export default function Home() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [lastCondition, setLastCondition] = useState<string | undefined>(
    undefined,
  );
  const [end, setEnd] = useState(false);

  const { data, isLoading, error } =
    trpcClient.commodityRouter.listCommodities.useQuery({
      lastCondition: lastCondition,
      size: 10,
    });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (data) {
      setCommodities(data?.commodities);
    }
  }, [data]);

  useEffect(() => {
    if (inView && commodities.length > 0 && !end) {
      loadMore(commodities[commodities.length - 1]).then((moreCommodities) => {
        if (moreCommodities.length === 0) {
          setEnd(true);
        } else {
          setCommodities([...commodities, ...moreCommodities]);
        }
      });
    }
  }, [inView, commodities, end]);

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  if (error) {
    return (
      <div className="flex justify-center items-center text-3xl">
        Something is Wrong!
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <div className="flex flex-col w-full h-full mb-12 mt-40">
          <div className="flex flex-wrap justify-start content-start w-4/5 h-full mx-auto gap-x-[5%]">
            {commodities.map((commodity, i) => {
              return (
                <div
                  key={`commodity-${i}`}
                  className="w-[30%] h-[40vh] mb-10 justify-self-start hover:shadow-xl hover:shadow-black/30 rounded-xl dark:hover:shadow-white/30"
                >
                  <MotionDiv
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    transition={{
                      delay: 0.1,
                      ease: "easeInOut",
                      duration: 0.5,
                    }}
                    viewport={{ amount: 0 }}
                    className={cn(
                      "rounded-xl hover:shadow-xl transition duration-200 shadow-input dark:shadow-none dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between pb-4 h-full w-full",
                    )}
                  >
                    {/* 商品封面 */}
                    <div className="relative h-[60%] w-full">
                      <Link
                        href={`/c/commodity/${commodity.id}`}
                        target="_blank"
                      >
                        <Image
                          src={commodity.cover}
                          fill
                          alt="image"
                          className="rounded-tl-xl rounded-tr-lg"
                        ></Image>
                      </Link>
                    </div>

                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {/* 商品名称 */}
                      <div className="flex justify-start mx-4 mt-6 text-xl h-10">
                        {commodity.name}
                      </div>
                      {/* 商品描述 */}
                      <div className="flex justify-start mx-8 mt-2 text-sm h-6 text-muted-foreground">
                        {commodity.description}
                      </div>
                      {/* 标签与价格 */}
                      <div className="flex items-center gap-4 justify-between mt-6">
                        <div className="flex items-center justify-start gap-1 ml-5">
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
                        <div className="cursor-pointer pr-4 text-cyan-900 dark:text-cyan-400">
                          ￥{commodity.price / 100}
                        </div>
                      </div>
                    </div>
                  </MotionDiv>
                </div>
              );
            })}
          </div>
          {end ? null : (
            <div className="text-center mx-auto mt-8 mb-8" ref={ref}>
              <LoaderCircle className="animate-spin w-8 h-8 text-orange-300" />
            </div>
          )}
        </div>
      )}
    </>
  );
}

const loadMore = async (commodity: Commodity) => {
  const response = await fetch(
    `/api/commodity?size=10&lastCondition=${commodity.createdAt.getTime()}`,
  );
  const data = await response.json();
  const commodities = data["commodities"].map((item: any) => {
    return {
      id: item.id,
      uid: item.uid,
      description: item.description,
      name: item.name,
      imageUrls: item.imageUrls,
      status: item.status,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      price: item.price,
      cover: item.cover,
    };
  });
  return commodities;
};
