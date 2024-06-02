import { Pixel } from "../types/pixel";
import { get2DCanvas, loadImage } from "../utils";

const INTERPOLATION = 4;

function convertToPixelsBuffer(imageData: Uint8ClampedArray): Pixel[] {
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

function convertToImageData(
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

async function extractOriginalImageData(imageUrl: string) {
  const {
    image,
    naturalWidth: width,
    naturalHeight: height,
  } = await loadImage(imageUrl);

  const { ctx, canvas } = get2DCanvas();

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height).data;

  checkInValidImageData(imageData, width, height);

  return {
    imageData,
    width,
    height,
  };
}

function checkInValidImageData(imageData: Uint8ClampedArray): void;
function checkInValidImageData(
  imageData: Uint8ClampedArray,
  width: number,
  height: number
): void;
function checkInValidImageData(
  imageData: Uint8ClampedArray,
  width?: number,
  height?: number
): void {
  if (imageData.length % INTERPOLATION !== 0) {
    throw new Error("It is Wrong image data.");
  }

  if (width && height && imageData.length !== width * height * INTERPOLATION) {
    throw new Error("It is Wrong image data.");
  }
}

export const baseBlur = async (
  imageUrl: string,
  effectFunc: (pixelsBuffer: Pixel[], width: number, height: number) => void
) => {
  const { imageData, width, height } = await extractOriginalImageData(imageUrl);

  console.log(imageData);

  const pixelsBuffer = convertToPixelsBuffer(imageData);

  effectFunc(pixelsBuffer, width, height);

  console.log(pixelsBuffer);

  return convertToImageData(pixelsBuffer, width, height);
};
