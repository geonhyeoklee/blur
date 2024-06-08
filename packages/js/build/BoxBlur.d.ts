declare class Blur {
    protected imageUrl: string;
    protected interpolation: 4;
    constructor(imageUrl: string);
    getImageUrl(): string;
    protected blur(imageUrl: string, effectFunc: (pixelsBuffer: Pixel[], width: number, height: number) => Promise<void>): Promise<ImageData>;
    protected extractOriginalImageData: (imageUrl: string) => Promise<{
        imageData: Uint8ClampedArray;
        width: number;
        height: number;
    }>;
    protected convertToPixelsBuffer(imageData: Uint8ClampedArray): Pixel[];
    protected convertToImageData(pixelsBuffer: Pixel[], width: number, height: number): ImageData;
    protected checkInValidImageData(imageData: Uint8ClampedArray): void;
    protected checkInValidImageData(imageData: Uint8ClampedArray, width: number, height: number): void;
}
export declare class BoxBlur extends Blur {
    protected imageUrl: string;
    private options;
    private workerUrl;
    constructor(imageUrl: string, options: {
        worker: boolean;
    });
    getOptions(): {
        worker: boolean;
    };
    run(): Promise<ImageData>;
    runWithWorker(): Promise<ImageData>;
    private boxBlurEffect;
    private boxBlurEffectInWorker;
}
export {};
