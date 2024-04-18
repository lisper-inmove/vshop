"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LTR_ADD_COMMODITY,
  LTR_ADD_COMMODITY_DESCRIPTION,
  LTR_ADD_COMMODITY_DOWNLOAD_LINK,
  LTR_ADD_COMMODITY_ESSAY,
  LTR_ADD_COMMODITY_LABELS,
  LTR_ADD_COMMODITY_NAME,
  LTR_ADD_COMMODITY_PRICE,
  LTR_SAVE,
  LTR_STATUS,
  LTR_TOO_MANY_COMMODITY_IMAGES,
  LTR_UPLOAD_COMMODITY_IMAGES,
  LTR_UPLOAD_COVER,
} from "@/constants/literals";
import { CircleMinus, UploadIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { trpcClient } from "@/trpc-config/client";
import { Commodity } from "@prisma/client";
import {
  COMMODITY_DATIL_IMAGE_HEIGHT,
  COMMODITY_DETAIL_IMAGE_WIDTH,
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
} from "@/constants/global";
import Image from "next/image";

import "md-editor-rt/lib/style.css";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";

interface Input {
  file: File | null;
}

interface Image {
  url: string;
}

export function AddCommodity({ commodity }: { commodity?: Commodity }) {
  // 商品名称
  const [name, setName] = useState<string>(commodity ? commodity.name : "");
  // 商品价格
  const [price, setPrace] = useState<number>(commodity ? commodity.price : 0);
  // 相关文章(详述)
  const [essay, setEssay] = useState<string>(commodity ? commodity.essay : "");
  // 商品详述计数
  const [essayCount, setEssayCount] = useState<number>(0);
  // 商品简介
  const [description, setDescription] = useState<string>(
    commodity ? commodity.description : "",
  );
  // 商品状态
  const [commodityStatus, setCommodityStatus] = useState<string>(
    commodity ? commodity.status : "CREATED",
  );
  // 商品关联图片
  const [commodityImages, setCommodityImages] = useState<string[]>(
    commodity ? commodity.imageUrls : [],
  );
  // 封面
  const [cover, setCover] = useState<string>(commodity ? commodity.cover : "");
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  // 创建商品
  const { mutate: createCommodityMutation } =
    trpcClient.commodityRouter.create.useMutation({});

  // 修改商品
  const { mutate: updateCommodityMutation } =
    trpcClient.commodityRouter.update.useMutation({});

  // 删除商品图片
  const removeImageByIndex = (index: number) => {
    setCommodityImages((images) => images.filter((_, idx) => idx != index));
  };

  const [link, setLink] = useState<string>(
    commodity && commodity.link ? commodity.link! : "",
  );

  const [labels, setLabels] = useState<string>(
    commodity ? commodity.labels : "",
  );
  const { toast } = useToast();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    width: number,
    height: number,
    prefix?: string,
  ) => {
    if (event.target.files) {
      if (prefix === null) {
        prefix = "";
      }
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      formData.append("width", width.toString());
      formData.append("height", height.toString());
      formData.append("prefix", prefix!);
      const response = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const image = data.image;
      return image;
    }
  };

  const uploadCover = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const image = await handleFileChange(
      event,
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
      "cover",
    );
    setCover(image);
  };

  const uploadDetailImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (commodityImages.length >= 5) {
      toast({
        description: LTR_TOO_MANY_COMMODITY_IMAGES,
        variant: "destructive",
      });
      return;
    }
    const image = await handleFileChange(
      event,
      COMMODITY_DETAIL_IMAGE_WIDTH,
      COMMODITY_DATIL_IMAGE_HEIGHT,
    );
    setCommodityImages([...commodityImages, image]);
  };

  const createCommodity = async () => {
    createCommodityMutation({
      name: name,
      description: description,
      price: price,
      imageUrls: commodityImages,
      status: commodityStatus,
      cover: cover,
      essay: essay,
      labels: labels,
      link: link,
    });
  };

  const updateCommodity = async () => {
    if (!commodity) {
      return;
    }
    updateCommodityMutation({
      uid: commodity.uid,
      name: name,
      description: description,
      price: price,
      imageUrls: commodityImages,
      status: commodityStatus,
      cover: cover,
      essay: essay,
      labels: labels,
      link: link,
    });
  };

  const saveHandler = async () => {
    if (commodity === undefined) {
      await createCommodity();
    } else {
      await updateCommodity();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {commodity ? (
          <p>{commodity.name}</p>
        ) : (
          <Button variant="outline">{LTR_ADD_COMMODITY}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col w-[95%] h-[95%] justify-between">
        <div className="flex gap-10 h-4/5">
          <div className="w-1/3">
            {/* 标题，封面，图片等 */}
            <DialogHeader>
              <DialogTitle>{LTR_ADD_COMMODITY}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 w-full h-full">
              <div className="flex items-center justify-between gap-4 w-full">
                <Label htmlFor="name" className="text-right">
                  {LTR_ADD_COMMODITY_NAME}:
                </Label>
                <Input
                  value={name}
                  id="name"
                  autoComplete="off"
                  onChange={(e) => setName(e.target.value)}
                  className="w-96"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="price" className="text-right">
                  {LTR_ADD_COMMODITY_PRICE}:
                </Label>
                <Input
                  value={price}
                  id="price"
                  autoComplete="off"
                  type="number"
                  onChange={(e) => setPrace(parseInt(e.target.value))}
                  className="w-96"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="price" className="text-right">
                  {LTR_ADD_COMMODITY_DOWNLOAD_LINK}:
                </Label>
                <Input
                  value={link}
                  id="link"
                  autoComplete="off"
                  type="text"
                  onChange={(e) => setLink(e.target.value)}
                  className="w-96"
                />
              </div>
              <div className="flex justify-between">
                <Label htmlFor="status" className="text-right">
                  {LTR_STATUS}:
                </Label>
                <div className="flex justify-between w-96">
                  <Select onValueChange={(v) => setCommodityStatus(v)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CREATED">CREATED</SelectItem>
                      <SelectItem value="SOLD_OUT">SOLD_OUT</SelectItem>
                      <SelectItem value="SELLING">SELLING</SelectItem>
                      <SelectItem value="OUT_OF_STOCK">OUT_OF_STOCK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div
                style={{
                  width: `${IMAGE_WIDTH}px`,
                  height: `${IMAGE_HEIGHT}px`,
                }}
              >
                <Input
                  style={{
                    display: "none",
                  }}
                  type="file"
                  onChange={(event) => uploadCover(event)}
                  ref={coverInputRef}
                ></Input>
                <div
                  style={{
                    width: `${IMAGE_WIDTH}px`,
                    height: `${IMAGE_HEIGHT}px`,
                  }}
                  onClick={() => coverInputRef?.current?.click()}
                  className="flex items-center justify-center border border-white"
                >
                  {cover !== "" ? (
                    <Image
                      src={cover}
                      height={IMAGE_HEIGHT}
                      width={IMAGE_WIDTH}
                      alt="cover"
                    ></Image>
                  ) : (
                    <div className="flex gap-4">
                      {LTR_UPLOAD_COVER} <UploadIcon />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-10">
                <div className="mb-5 text-red-500">
                  {LTR_UPLOAD_COMMODITY_IMAGES}:
                </div>
                {commodityImages.length >= 5 ? null : (
                  <Input
                    type="file"
                    onChange={(event) => uploadDetailImage(event)}
                    className="mb-5"
                  ></Input>
                )}
                <div className="flex flex-col gap-4 items-center">
                  {commodityImages.map((url, index) => {
                    return (
                      <div
                        key={`commodity-images-${index}`}
                        className="flex items-center border-b border-white"
                      >
                        <p className="text-ellipsis line-clamp-1 inline-block ">
                          {index + 1}: {url}
                        </p>
                        <CircleMinus
                          onClick={() => removeImageByIndex(index)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {/*相关文章编辑*/}
          <div className="flex flex-col w-2/3 p-5 gap-10">
            <div className="flex items-center justify-start gap-4">
              <Label htmlFor="description" className="text-right text-xl">
                {LTR_ADD_COMMODITY_DESCRIPTION}:
              </Label>
              <Input
                placeholder="描述(在商品列表页展示的内容)"
                className="w-96"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="essay" className="text-right text-xl">
                {LTR_ADD_COMMODITY_ESSAY}({essayCount}/2000):
              </Label>
              <Textarea
                className="resize-none mt-4"
                placeholder="关于商品的信息"
                onChange={(e) => {
                  setEssayCount(e.target.value.length);
                  setEssay(e.target.value);
                }}
                value={essay}
              ></Textarea>
              {/*

              <MdEditor
                modelValue={essay}
                onChange={setEssay}
                preview={false}
                theme="dark"
                className="w-full h-full"
                style={{
                  height: "600px",
                }}
              />
              */}
            </div>
            <div>
              <Label htmlFor="essay" className="text-right text-xl">
                {LTR_ADD_COMMODITY_LABELS}
              </Label>
              <Textarea
                className="resize-none mt-4"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
              ></Textarea>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={saveHandler}>
            {LTR_SAVE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
