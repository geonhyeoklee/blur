import { get2DCanvas, getPixel, loadImage } from "./utils";
import { clamp } from "./utils/math";

function getBoxBlurImageData(
  data: Uint8ClampedArray,
  sw: number,
  sy: number,
  intensity?: number
): ImageData {
  const INTERPOLATION = 4;

  if (data.length % INTERPOLATION !== 0) {
    throw new Error("It is Wrong image data.");
  }

  if (data.length !== sw * sy * INTERPOLATION) {
    throw new Error("It is Wrong image data.");
  }

  const pixelsBuffer: number[][] = [];
  let pixelBuffer: number[] = [];
  for (const value of data) {
    pixelBuffer.push(value);

    if (pixelBuffer.length === INTERPOLATION) {
      pixelsBuffer.push(pixelBuffer);
      pixelBuffer = [];
    }
  }

  const clampedIntensity = clamp(intensity ?? 0.2, 0, 1);

  // 시간 복잡도 O(n^3), 공간 복잡도 O(n)
  for (let j = 0; j < sy; j++) {
    for (let i = 0; i < sw; i++) {
      const neighborPixelSum = [0, 0, 0, 255];

      for (let si = 0; si < 5; si++) {
        const neighborPixel = getPixel(pixelsBuffer, sw, sy, i + si - 2, j);
        neighborPixelSum[0] += neighborPixel[0];
        neighborPixelSum[1] += neighborPixel[1];
        neighborPixelSum[2] += neighborPixel[2];
      }

      pixelsBuffer[i + sw * j][0] = Math.floor(
        neighborPixelSum[0] * clampedIntensity
      );
      pixelsBuffer[i + sw * j][1] = Math.floor(
        neighborPixelSum[1] * clampedIntensity
      );
      pixelsBuffer[i + sw * j][2] = Math.floor(
        neighborPixelSum[2] * clampedIntensity
      );
    }
  }

  const newData = new Uint8ClampedArray(pixelsBuffer.flat());
  return new ImageData(newData, sw, sy);
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
  return getBoxBlurImageData(imageData, width, height, option?.intensity);
}

export { boxBlur };
