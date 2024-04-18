import { IMAGE_HEIGHT, IMAGE_WIDTH } from "@/constants/global";
import logger from "@/lib/logger";
import OSS from "ali-oss";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// 配置OSS客户端
const client = new OSS({
  region: process.env.OSS_ACCESS_REGION_ID!,
  accessKeyId: process.env.OSS_ACCESS_KEY!,
  accessKeySecret: process.env.OSS_ACCESS_SECRET!,
  bucket: process.env.OSS_ACCESS_BUCKET_NAME,
});

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file");
  const width = parseInt(formData.get("width")!.toString());
  const height = parseInt(formData.get("height")!.toString());
  const prefix = formData.get("prefix");
  if (!file || !(file instanceof File)) {
    throw new Error("No file uploaded or wrong input name.");
  }
  const fileBuffer = await file.arrayBuffer();
  const image = await sharp(fileBuffer).resize(width, height).png().toBuffer();
  let filename = file.name;
  if (prefix) {
    filename = `${prefix}-${file.name}`;
  }
  const result = await client.put(filename, image);
  return NextResponse.json({ code: 0, image: result.url });
};

// export const POST = async (req: NextRequest, res: NextResponse) => {
//   const formData = await req.formData();
//   const images = [];
//   for (let idx = 0; idx < 10; idx++) {
//     try {
//       const file = formData.get(`files-${idx}`);
//       if (!file || !(file instanceof File)) {
//         // throw new Error("No file uploaded or wrong input name.");
//       } else {
//         let image;
//         const fileBuffer = await file.arrayBuffer();
//         if (idx === 0) {
//           // 第一张作为封面
//           image = await uploadImage(
//             fileBuffer,
//             IMAGE_WIDTH,
//             IMAGE_HEIGHT,
//             `cover-${file.name}`,
//           );
//           images.push(image.url);
//         }
//
//         image = await uploadImage();
//
//         const image = await sharp(await file.arrayBuffer())
//           .resize(IMAGE_WIDTH, IMAGE_HEIGHT)
//           .png()
//           .toBuffer();
//
//         // const buffer = Buffer.from(await file.arrayBuffer());
//         const result = await client.put(file.name, image);
//         images.push({
//           url: result.url,
//         });
//         logger.info(`upload file success: ${file.name}`);
//       }
//     } catch (error) {
//       logger.error(`upload file error: ${error}`);
//       // throw new Error("Upload file error");
//     }
//   }
//   return NextResponse.json({ code: 0, images: images });
//   // await client.put(files.name, files.name);
// };

const uploadImage = async (
  fileBuffer: ArrayBuffer,
  width: number,
  height: number,
  name: string,
) => {
  const image = await sharp(fileBuffer).resize(width, height).png().toBuffer();
  // const buffer = Buffer.from(await file.arrayBuffer());
  const result = await client.put(name, image);
  return result;
};
