import { BoxBlur } from 'box-blur'
import './style.css'

const imageUrl = '/sample.jpeg'

async function main() {
  const imageData = await new BoxBlur(imageUrl, { worker: true }).run()

  const canvas = document.getElementById('canvas')! as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!

  canvas.width = imageData.width
  canvas.height = imageData.height

  ctx.putImageData(imageData, 0, 0)
}

main()
