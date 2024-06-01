import { clamp } from "./math";

export function getPixel(
  data: number[][],
  width: number,
  height: number,
  i: number,
  j: number
) {
  i = clamp(i, 0, width - 1);
  j = clamp(j, 0, height - 1);

  return data[i + width * j];
}
