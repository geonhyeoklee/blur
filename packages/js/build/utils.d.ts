export declare function get2DCanvas(): Readonly<{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
}>;
export declare function loadImage(url: string): Promise<{
    image: HTMLImageElement;
    naturalWidth: number;
    naturalHeight: number;
}>;
export declare function loadImage(url: string, width: number): Promise<{
    image: HTMLImageElement;
    naturalWidth: number;
    naturalHeight: number;
}>;
export declare function loadImage(url: string, width: number, height: number): Promise<{
    image: HTMLImageElement;
    naturalWidth: number;
    naturalHeight: number;
}>;
export declare function clamp(value: number, min: number, max: number): number;
export declare function removeDecimalPoint(value: number): number;
export declare function getPixel(data: Pixel[], width: number, height: number, i: number, j: number): Pixel;
