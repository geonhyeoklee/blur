import { get2DCanvas, getPixel, loadImage, removeDecimalPoint } from './utils'
import { Pixel } from './types'

class Blur {
  protected interpolation = 4 as const

  constructor(protected imageUrl: string) {}

  getImageUrl() {
    return this.imageUrl
  }

  protected async blur(
    imageUrl: string,
    effectFunc: (pixelsBuffer: Pixel[], width: number, height: number) => Promise<void>,
  ) {
    const { imageData, width, height } = await this.extractOriginalImageData(imageUrl)

    const pixelsBuffer = this.convertToPixelsBuffer(imageData)

    await effectFunc(pixelsBuffer, width, height)

    return this.convertToImageData(pixelsBuffer, width, height)
  }

  protected extractOriginalImageData = async (imageUrl: string) => {
    const { image, naturalWidth: width, naturalHeight: height } = await loadImage(imageUrl)

    const { ctx, canvas } = get2DCanvas()

    canvas.width = width
    canvas.height = height

    ctx.drawImage(image, 0, 0, width, height)

    const imageData = ctx.getImageData(0, 0, width, height).data

    this.checkInValidImageData(imageData, width, height)

    return {
      imageData,
      width,
      height,
    }
  }

  protected convertToPixelsBuffer(imageData: Uint8ClampedArray): Pixel[] {
    const pixelsBuffer: Pixel[] = []
    let pixelBuffer: number[] = []
    for (const data of imageData) {
      pixelBuffer.push(data)

      if (pixelBuffer.length === this.interpolation) {
        pixelsBuffer.push(pixelBuffer as Pixel)
        pixelBuffer = []
      }
    }

    return pixelsBuffer
  }

  protected convertToImageData(pixelsBuffer: Pixel[], width: number, height: number) {
    return new ImageData(new Uint8ClampedArray(pixelsBuffer.flat()), width, height)
  }

  protected checkInValidImageData(imageData: Uint8ClampedArray): void
  protected checkInValidImageData(imageData: Uint8ClampedArray, width: number, height: number): void
  protected checkInValidImageData(imageData: Uint8ClampedArray, width?: number, height?: number): void {
    if (imageData.length % this.interpolation !== 0) {
      throw new Error('It is Wrong image data.')
    }

    if (width && height && imageData.length !== width * height * this.interpolation) {
      throw new Error('It is Wrong image data.')
    }
  }
}

type Options = {
  worker: boolean
}

export class BoxBlur extends Blur {
  constructor(
    protected imageUrl: string,
    private options: Options,
  ) {
    super(imageUrl)
  }

  getOptions(): Options {
    return this.options
  }

  async run() {
    return await this.blur(this.imageUrl, this.boxBlurEffect)
  }

  private async boxBlurEffect(pixelsBuffer: Pixel[], width: number, height: number): Promise<void> {
    const MAX_NEIGHBOR = 5
    const MIDDLE_NEIGHBOR = Math.floor(MAX_NEIGHBOR / 2)
    const INTENSITY = 1 / MAX_NEIGHBOR

    // TODO: 시간 복잡도 개선 필요
    // 시간 복잡도 O(n^3), 공간 복잡도 O(n)
    // X축 적용
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        let neighborPixelSum: Pixel = [0, 0, 0, 255]

        for (let si = 0; si < MAX_NEIGHBOR; si++) {
          const neighborPixel = getPixel(pixelsBuffer, width, height, i + si - MIDDLE_NEIGHBOR, j)

          neighborPixelSum[0] += neighborPixel[0]
          neighborPixelSum[1] += neighborPixel[1]
          neighborPixelSum[2] += neighborPixel[2]
        }

        const targetPixelIndex = i + width * j

        pixelsBuffer[targetPixelIndex][0] = removeDecimalPoint(neighborPixelSum[0] * INTENSITY)
        pixelsBuffer[targetPixelIndex][1] = removeDecimalPoint(neighborPixelSum[1] * INTENSITY)
        pixelsBuffer[targetPixelIndex][2] = removeDecimalPoint(neighborPixelSum[2] * INTENSITY)
      }
    }

    // Y축 적용
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const neighborPixelSum: Pixel = [0, 0, 0, 255]

        for (let si = 0; si < MAX_NEIGHBOR; si++) {
          const neighborPixel = getPixel(pixelsBuffer, width, height, i, j + si - MIDDLE_NEIGHBOR)

          neighborPixelSum[0] += neighborPixel[0]
          neighborPixelSum[1] += neighborPixel[1]
          neighborPixelSum[2] += neighborPixel[2]
        }

        const targetPixelIndex = i + width * j

        pixelsBuffer[targetPixelIndex][0] = removeDecimalPoint(neighborPixelSum[0] * INTENSITY)
        pixelsBuffer[targetPixelIndex][1] = removeDecimalPoint(neighborPixelSum[1] * INTENSITY)
        pixelsBuffer[targetPixelIndex][2] = removeDecimalPoint(neighborPixelSum[2] * INTENSITY)
      }
    }
  }
}
