export function get2DCanvas(): Readonly<{
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  return { canvas, ctx };
}
