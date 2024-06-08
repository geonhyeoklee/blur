type Pixel = [number, number, number, number];
declare function boxBlurEffect(pixelsBuffer: Pixel[], width: number, height: number): void;
declare function removeDecimalPoint(value: number): number;
declare function getPixel(data: Pixel[], width: number, height: number, i: number, j: number): Pixel;
declare function clamp(value: number, min: number, max: number): number;
