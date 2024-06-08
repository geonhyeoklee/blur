export function get2DCanvas(): Readonly<{
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  return { canvas, ctx };
}

export async function loadImage(url: string): Promise<{
  image: HTMLImageElement;
  naturalWidth: number;
  naturalHeight: number;
}>;
export async function loadImage(
  url: string,
  width: number
): Promise<{
  image: HTMLImageElement;
  naturalWidth: number;
  naturalHeight: number;
}>;
export async function loadImage(
  url: string,
  width: number,
  height: number
): Promise<{
  image: HTMLImageElement;
  naturalWidth: number;
  naturalHeight: number;
}>;
export async function loadImage(
  url: string,
  width?: number,
  height?: number
): Promise<{
  image: HTMLImageElement;
  naturalWidth: number;
  naturalHeight: number;
}> {
  const image = new Image();
  image.width = width ?? 0;
  image.height = height ?? 0;

  return new Promise((resolve, reject) => {
    image.onload = () =>
      resolve({
        image,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
      });
    image.onerror = reject;
    image.src = url;
  });
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function removeDecimalPoint(value: number) {
  return Math.floor(value);
}

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
