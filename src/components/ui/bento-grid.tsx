import { IMAGE_HEIGHT, IMAGE_WIDTH } from "@/constants/global";
import { cn } from "@/lib/utils";
import { Commodity } from "@prisma/client";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { MotionDiv } from "../MotionDiv";
import { DisplayCommodity } from "../DisplayCommodity";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-start flex-wrap gap-10 mx-auto",
        className,
      )}
    >
      {children}
    </div>
  );
};

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const BentoGridItem = ({
  className,
  commodity,
  delayBase,
}: {
  className?: string;
  commodity: Commodity;
  delayBase: number;
}) => {
  return (
    <div className="group-hover/bento:translate-x-2 transition duration-200">
      <MotionDiv
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{
          delay: 0.1 * delayBase,
          ease: "easeInOut",
          duration: 0.5,
        }}
        viewport={{ amount: 0 }}
        className={cn(
          "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4 h-full pb-4",
          className,
        )}
      >
        <div
          className="flex items-center justify-center"
          style={{
            height: IMAGE_HEIGHT,
            width: IMAGE_WIDTH,
          }}
        >
          <Image
            src={commodity.cover}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            alt="image"
            className="rounded-tl-xl rounded-tr-lg"
          ></Image>
        </div>
        <div className="flex items-start font-sans font-bold text-lg text-neutral-600 dark:text-neutral-200 mb-3 mt-2 line-clamp-1 text-ellipsis pl-4">
          {commodity.name}
        </div>
        <div className="flex h-12 items-start font-sans font-normal text-neutral-600 text-sm dark:text-neutral-300 text-ellipsis line-clamp-2 pl-4 pr-4 text-left">
          {commodity.description}
        </div>
        <div className="flex justify-end mt-4 mr-4 gap-5">
          {/*

          <div className="cursor-pointer">
            <Heart />
          </div>
          <div className="cursor-pointer">
            <Star />
          </div>
          */}
          <div className="cursor-pointer">
            <ShoppingCart />
          </div>
          <div className="cursor-pointer">￥{commodity.price / 100}</div>
        </div>
      </MotionDiv>
    </div>
  );
};
