import { Pixel } from '../types'
import { getPixel, removeDecimalPoint } from '../utils'

self.onmessage = async (e: MessageEvent) => {
  const pixelsBuffer = e.data.pixelsBuffer
  const width = e.data.width
  const height = e.data.height

  boxBlurEffect(pixelsBuffer, width, height)

  self.postMessage(pixelsBuffer)
}

function boxBlurEffect(pixelsBuffer: Pixel[], width: number, height: number): void {
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

// function removeDecimalPoint(value: number) {
//   return Math.floor(value)
// }

// function getPixel(data: Pixel[], width: number, height: number, i: number, j: number): Pixel {
//   i = clamp(i, 0, width - 1)
//   j = clamp(j, 0, height - 1)

//   return data[i + width * j]
// }

// function clamp(value: number, min: number, max: number) {
//   return Math.max(min, Math.min(value, max))
// }
