"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoxBlur = void 0;
const utils_1 = require("./utils");
class Blur {
    imageUrl;
    interpolation = 4;
    constructor(imageUrl) {
        this.imageUrl = imageUrl;
    }
    getImageUrl() {
        return this.imageUrl;
    }
    async blur(imageUrl, effectFunc) {
        const { imageData, width, height } = await this.extractOriginalImageData(imageUrl);
        const pixelsBuffer = this.convertToPixelsBuffer(imageData);
        await effectFunc(pixelsBuffer, width, height);
        return this.convertToImageData(pixelsBuffer, width, height);
    }
    extractOriginalImageData = async (imageUrl) => {
        const { image, naturalWidth: width, naturalHeight: height, } = await (0, utils_1.loadImage)(imageUrl);
        const { ctx, canvas } = (0, utils_1.get2DCanvas)();
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height).data;
        this.checkInValidImageData(imageData, width, height);
        return {
            imageData,
            width,
            height,
        };
    };
    convertToPixelsBuffer(imageData) {
        const pixelsBuffer = [];
        let pixelBuffer = [];
        for (const data of imageData) {
            pixelBuffer.push(data);
            if (pixelBuffer.length === this.interpolation) {
                pixelsBuffer.push(pixelBuffer);
                pixelBuffer = [];
            }
        }
        return pixelsBuffer;
    }
    convertToImageData(pixelsBuffer, width, height) {
        return new ImageData(new Uint8ClampedArray(pixelsBuffer.flat()), width, height);
    }
    checkInValidImageData(imageData, width, height) {
        if (imageData.length % this.interpolation !== 0) {
            throw new Error("It is Wrong image data.");
        }
        if (width &&
            height &&
            imageData.length !== width * height * this.interpolation) {
            throw new Error("It is Wrong image data.");
        }
    }
}
class BoxBlur extends Blur {
    imageUrl;
    options;
    workerUrl = "./workers/box-blur-worker.ts";
    constructor(imageUrl, options) {
        super(imageUrl);
        this.imageUrl = imageUrl;
        this.options = options;
    }
    getOptions() {
        return this.options;
    }
    async run() {
        return await this.blur(this.imageUrl, this.boxBlurEffect);
    }
    async runWithWorker() {
        return await this.blur(this.imageUrl, this.boxBlurEffectInWorker);
    }
    async boxBlurEffect(pixelsBuffer, width, height) {
        const MAX_NEIGHBOR = 5;
        const MIDDLE_NEIGHBOR = Math.floor(MAX_NEIGHBOR / 2);
        const INTENSITY = 1 / MAX_NEIGHBOR;
        // TODO: 시간 복잡도 개선 필요
        // 시간 복잡도 O(n^3), 공간 복잡도 O(n)
        // X축 적용
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                let neighborPixelSum = [0, 0, 0, 255];
                for (let si = 0; si < MAX_NEIGHBOR; si++) {
                    const neighborPixel = getPixel(pixelsBuffer, width, height, i + si - MIDDLE_NEIGHBOR, j);
                    neighborPixelSum[0] += neighborPixel[0];
                    neighborPixelSum[1] += neighborPixel[1];
                    neighborPixelSum[2] += neighborPixel[2];
                }
                const targetPixelIndex = i + width * j;
                pixelsBuffer[targetPixelIndex][0] = removeDecimalPoint(neighborPixelSum[0] * INTENSITY);
                pixelsBuffer[targetPixelIndex][1] = removeDecimalPoint(neighborPixelSum[1] * INTENSITY);
                pixelsBuffer[targetPixelIndex][2] = removeDecimalPoint(neighborPixelSum[2] * INTENSITY);
            }
        }
        // Y축 적용
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                const neighborPixelSum = [0, 0, 0, 255];
                for (let si = 0; si < MAX_NEIGHBOR; si++) {
                    const neighborPixel = getPixel(pixelsBuffer, width, height, i, j + si - MIDDLE_NEIGHBOR);
                    neighborPixelSum[0] += neighborPixel[0];
                    neighborPixelSum[1] += neighborPixel[1];
                    neighborPixelSum[2] += neighborPixel[2];
                }
                const targetPixelIndex = i + width * j;
                pixelsBuffer[targetPixelIndex][0] = removeDecimalPoint(neighborPixelSum[0] * INTENSITY);
                pixelsBuffer[targetPixelIndex][1] = removeDecimalPoint(neighborPixelSum[1] * INTENSITY);
                pixelsBuffer[targetPixelIndex][2] = removeDecimalPoint(neighborPixelSum[2] * INTENSITY);
            }
        }
    }
    async boxBlurEffectInWorker(pixelsBuffer, width, height) {
        if (!window.Worker) {
            throw new Error("Not found worker");
        }
        //@ts-ignore
        const worker = new Worker(new URL(this.workerUrl, import.meta.url));
        worker.postMessage({
            pixelsBuffer,
            width,
            height,
        });
        return await new Promise((resolve) => {
            worker.onmessage = () => {
                resolve();
            };
        });
    }
}
exports.BoxBlur = BoxBlur;
//# sourceMappingURL=BoxBlur.js.map