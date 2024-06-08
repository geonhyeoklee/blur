"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPixel = exports.removeDecimalPoint = exports.clamp = exports.loadImage = exports.get2DCanvas = void 0;
function get2DCanvas() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    return { canvas, ctx };
}
exports.get2DCanvas = get2DCanvas;
async function loadImage(url, width, height) {
    const image = new Image();
    image.width = width ?? 0;
    image.height = height ?? 0;
    return new Promise((resolve, reject) => {
        image.onload = () => resolve({
            image,
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
        });
        image.onerror = reject;
        image.src = url;
    });
}
exports.loadImage = loadImage;
function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}
exports.clamp = clamp;
function removeDecimalPoint(value) {
    return Math.floor(value);
}
exports.removeDecimalPoint = removeDecimalPoint;
function getPixel(data, width, height, i, j) {
    i = clamp(i, 0, width - 1);
    j = clamp(j, 0, height - 1);
    return data[i + width * j];
}
exports.getPixel = getPixel;
