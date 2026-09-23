export const renderList = [
  "classicBit",
  'notGate'
] as const

export type Renderer = typeof renderList[number]
export type RendererFunction = (ctx: CanvasRenderingContext2D, data: {
  x: number,
  y: number
}) => void

export const renderFunctionMap: Record<Renderer, RendererFunction> = {
  classicBit: (ctx, { x, y }) => {
    const width = 10;
    const xOffset = width / 2;
    const height = 10;
    const yOffset = height / 2;
    ctx.fillStyle = "black"
    ctx.fillRect(x - xOffset, y - yOffset, width, height)
  },
  notGate: (ctx, { x, y }) => {
    const baseWidth = 20;
    const baseHeight = 20;
    const xOffset = baseWidth / 2;
    const yOffset = baseHeight / 2;

    ctx.fillStyle = ""

  }
}
