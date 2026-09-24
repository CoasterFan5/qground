export type RenderData = {
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
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


  abstract render(params: RenderData): void
  abstract onClick(): void
  abstract toJSON(): object
}
