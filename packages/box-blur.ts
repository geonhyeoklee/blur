import {
  get2DCanvas,
  getPixel,
  loadImage,
  clamp,
  removeDecimalPoint,
} from "./utils";
import { Pixel } from "./types/pixel";

const INTERPOLATION = 4;

function convertImageDataToPixelsBuffer(imageData: Uint8ClampedArray): Pixel[] {
  const pixelsBuffer: Pixel[] = [];
  let pixelBuffer: number[] = [];
  for (const data of imageData) {
    pixelBuffer.push(data);

    if (pixelBuffer.length === INTERPOLATION) {
      pixelsBuffer.push(pixelBuffer as Pixel);
      pixelBuffer = [];
    }
  }

  return pixelsBuffer;
}

function convertPixelsBufferToImageData(
  pixelsBuffer: Pixel[],
  width: number,
  height: number
) {
  return new ImageData(
    new Uint8ClampedArray(pixelsBuffer.flat()),
    width,
    height
  );
}

function calculateBoxBlurPixelsBuffer(
  pixelsBuffer: Pixel[],
  intensity: number,
  width: number,
  height: number
): void {
  const MAX_NEIGHBOR_COUNT = 5;
  const MIDDLE_NEIGHBOR_INDEX = Math.floor(MAX_NEIGHBOR_COUNT / 2);

  // TODO: 시간 복잡도 개선 필요
  // 시간 복잡도 O(n^3), 공간 복잡도 O(n)
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const neighborPixelSum: Pixel = [0, 0, 0, 255];

      for (let si = 0; si < MAX_NEIGHBOR_COUNT; si++) {
        const neighborPixel = getPixel(
          pixelsBuffer,
          width,
          height,
          i + si - MIDDLE_NEIGHBOR_INDEX,
          j
        );
        neighborPixelSum[0] += neighborPixel[0];
        neighborPixelSum[1] += neighborPixel[1];
        neighborPixelSum[2] += neighborPixel[2];
      }

      const targetPixelIndex = i + width * j;

      pixelsBuffer[targetPixelIndex][0] = removeDecimalPoint(
        neighborPixelSum[0] * intensity
      );
      pixelsBuffer[targetPixelIndex][1] = removeDecimalPoint(
        neighborPixelSum[1] * intensity
      );
      pixelsBuffer[targetPixelIndex][2] = removeDecimalPoint(
        neighborPixelSum[2] * intensity
      );
    }
  }
}

function getBlurImageData(
  imageData: Uint8ClampedArray,
  width: number,
  height: number,
  intensity?: number
): ImageData {
  if (imageData.length % INTERPOLATION !== 0) {
    throw new Error("It is Wrong image data.");
  }

  if (imageData.length !== width * height * INTERPOLATION) {
    throw new Error("It is Wrong image data.");
  }

  const pixelsBuffer = convertImageDataToPixelsBuffer(imageData);
  const clampedIntensity = clamp(intensity ?? 0.2, 0, 1);

  calculateBoxBlurPixelsBuffer(pixelsBuffer, clampedIntensity, width, height);

  return convertPixelsBufferToImageData(pixelsBuffer, width, height);
}

async function getOriginalImageData(imageUrl: string) {
  const { image, naturalWidth, naturalHeight } = await loadImage(imageUrl);
  const { ctx } = get2DCanvas();
  const dw = naturalWidth;
  const dh = naturalHeight;
  ctx.drawImage(image, 0, 0, dw, dh);

  return {
    imageData: ctx.getImageData(0, 0, dw, dh).data,
    width: dw,
    height: dh,
  };
}

async function boxBlur(
  imageUrl: string,
  option?: { intensity?: number }
): Promise<ImageData> {
  const { imageData, width, height } = await getOriginalImageData(imageUrl);
  return getBlurImageData(imageData, width, height, option?.intensity);
}

export { boxBlur };
