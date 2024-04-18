"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageSlideProps {
  urls: string[];
}

const ImageSlider = ({ urls }: ImageSlideProps) => {
  const [index, setIndex] = useState<number>(0);
  const images = urls.map((url) => {
    return (
      <Image
        key={`${index}-image-slide`}
        src={url}
        fill
        alt="image"
        className={`absolute rounded-3xl`}
      ></Image>
    );
  });

  const toPrev = () => {
    if (index === 0) {
      return;
    }

    setIndex(index - 1);
  };

  const toNext = () => {
    if (index === urls.length - 1) {
      return;
    }
    setIndex(index + 1);
  };

  return (
    <>
      <div className="relative w-full h-full">
        <div
          className={`flex items-center justify-center absolute z-50 h-16 w-16 rounded-full dark:bg-zinc-50 bg-zinc-300 text-black left-10 top-1/2 ${index === 0 ? "opacity-10" : "opacity-50"} transform -translate-x-32`}
          onClick={toPrev}
        >
          <ChevronLeft />
        </div>
        <div>{images[index]} </div>
        <div
          className={`flex absolute items-center justify-center z-50 h-16 w-16 rounded-full dark:bg-zinc-50 bg-zinc-300 text-black right-10 ${index === urls.length - 1 ? "opacity-10" : "opacity-50"} top-1/2 transform translate-x-32`}
          onClick={toNext}
        >
          <ChevronRight />
        </div>
      </div>
    </>
  );
};

export default ImageSlider;
