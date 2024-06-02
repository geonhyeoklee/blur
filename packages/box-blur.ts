import { getPixel, removeDecimalPoint } from "./utils";
import { baseBlur } from "./core";
import { Pixel, RGBA } from "./types/pixel";

export async function boxBlur(imageUrl: string): Promise<ImageData> {
  return await baseBlur(imageUrl, calculateBoxBlurPixelsBuffer);
}

function calculateBoxBlurPixelsBuffer(
  pixelsBuffer: Pixel[],
  width: number,
  height: number
): void {
  const MAX_NEIGHBOR = 5;
  const MIDDLE_NEIGHBOR = Math.floor(MAX_NEIGHBOR / 2);
  const INTENSITY = 1 / MAX_NEIGHBOR;

  // TODO: 시간 복잡도 개선 필요
  // 시간 복잡도 O(n^3), 공간 복잡도 O(n)
  // X축 적용
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const neighborPixelSum: Pixel = [0, 0, 0, 255];

      for (let si = 0; si < MAX_NEIGHBOR; si++) {
        const neighborPixel = getPixel(
          pixelsBuffer,
          width,
          height,
          i + si - MIDDLE_NEIGHBOR,
          j
        );

        neighborPixelSum[RGBA.Red] += neighborPixel[RGBA.Red];
        neighborPixelSum[RGBA.Green] += neighborPixel[RGBA.Green];
        neighborPixelSum[RGBA.Blue] += neighborPixel[RGBA.Blue];
      }

      const targetPixelIndex = i + width * j;

      pixelsBuffer[targetPixelIndex][RGBA.Red] = removeDecimalPoint(
        neighborPixelSum[RGBA.Red] * INTENSITY
      );
      pixelsBuffer[targetPixelIndex][RGBA.Green] = removeDecimalPoint(
        neighborPixelSum[RGBA.Green] * INTENSITY
      );
      pixelsBuffer[targetPixelIndex][RGBA.Blue] = removeDecimalPoint(
        neighborPixelSum[RGBA.Blue] * INTENSITY
      );
    }
  }

  // Y축 적용
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const neighborPixelSum: Pixel = [0, 0, 0, 255];

      for (let si = 0; si < MAX_NEIGHBOR; si++) {
        const neighborPixel = getPixel(
          pixelsBuffer,
          width,
          height,
          i,
          j + si - MIDDLE_NEIGHBOR
        );

        neighborPixelSum[RGBA.Red] += neighborPixel[RGBA.Red];
        neighborPixelSum[RGBA.Green] += neighborPixel[RGBA.Green];
        neighborPixelSum[RGBA.Blue] += neighborPixel[RGBA.Blue];
      }

      const targetPixelIndex = i + width * j;

      pixelsBuffer[targetPixelIndex][RGBA.Red] = removeDecimalPoint(
        neighborPixelSum[RGBA.Red] * INTENSITY
      );
      pixelsBuffer[targetPixelIndex][RGBA.Green] = removeDecimalPoint(
        neighborPixelSum[RGBA.Green] * INTENSITY
      );
      pixelsBuffer[targetPixelIndex][RGBA.Blue] = removeDecimalPoint(
        neighborPixelSum[RGBA.Blue] * INTENSITY
      );
    }
  }
}
