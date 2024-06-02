import { baseBlur } from "./core";

const noopFunc = () => {};

export async function gaussianBlur(imageUrl: string): Promise<ImageData> {
  return await baseBlur(imageUrl, noopFunc);
}
