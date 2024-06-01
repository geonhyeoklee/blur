import { clamp } from "./math";
import { Pixel } from "../types/pixel";

export function getPixel(
  data: Pixel[],
  width: number,
  height: number,
  i: number,
  j: number
): Pixel {
  i = clamp(i, 0, width - 1);
  j = clamp(j, 0, height - 1);

  return data[i + width * j];
}
