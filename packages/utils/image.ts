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
