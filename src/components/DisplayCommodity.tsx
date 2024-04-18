"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Commodity } from "@prisma/client";
import { BentoGridItem } from "./ui/bento-grid";
import ImageSlider from "./ImageSlider";
import { MdPreview } from "md-editor-rt";

import "md-editor-rt/lib/preview.css";

export const DisplayCommodity = ({
  commodity,
  index,
}: {
  commodity: Commodity;
  index: number;
}) => {
  const [id] = useState("preview-only");
  return (
    <Dialog>
      <DialogTrigger>
        <BentoGridItem commodity={commodity} delayBase={index % 10} />
      </DialogTrigger>
      <DialogContent className="w-[80vw]">
        <div className="flex items-start justify-center gap-10 p-10 h-[80vh] ">
          {/* 展示图片 */}
          <div className="w-1/2 h-full rounded-lg">
            <ImageSlider urls={commodity.imageUrls} />
          </div>
          {/*展示标题等信息*/}
          <div className="flex flex-col w-1/2 mx-auto justify-start gap-10">
            <MdPreview
              editorId={id}
              modelValue={commodity.essay}
              theme="dark"
              className="bg-transparent transform -translate-y-10"
              style={{
                backgroundColor: "transparent",
                color: "white",
              }}
            />
          </div>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
