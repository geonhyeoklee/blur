import { BoxBlur } from 'box-blur'

const imageUrl = '/sample.jpeg'

async function main() {
  const boxblurContext = new BoxBlur(imageUrl, { worker: true });
  const imageData = await boxblurContext.run();

  const canvas = document.getElementById('canvas')! as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!

  canvas.width = imageData.width
  canvas.height = imageData.height

  ctx.putImageData(imageData, 0, 0)
}

main()
