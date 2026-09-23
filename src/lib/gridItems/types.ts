export type CanvasData = {
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
}

export abstract class GridItem {
  id: string
  x: number
  y: number
  width: number
  height: number

  constructor({ id, x, y }: { id: string, x: number, y: number }) {
    this.id = id
    this.x = x
    this.y = y
    this.width = 40;
    this.height = 40;
  }

  setHeight(height: number) {
    this.height = height
  }

  setWidth(width: number) {
    this.width = width
  }

  getTruePosition(canvasData: CanvasData) {
    const xOffset = this.width / 2
    const yOffset = this.height / 2
    const trueX = this.x - xOffset + canvasData.offsetX
    const trueY = this.y - yOffset + canvasData.offsetY

    return {
      x: trueX,
      y: trueY,
      ctx: canvasData.ctx
    }
  }

  abstract render(canvasData: CanvasData): void
  abstract onClick(): void
  abstract toJSON(): object
}
