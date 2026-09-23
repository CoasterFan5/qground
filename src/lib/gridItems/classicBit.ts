import { GridItem, type CanvasData } from './types'

export class ClassicBit extends GridItem {
  state: 0 | 1 = 0

  onClick() {
    this.state = this.state === 0 ? 1 : 0
  }

  render(canvasData: CanvasData) {
    const { x, y, ctx } = this.getTruePosition(canvasData)
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.fillRect(x, y, this.width, this.height)
    ctx.stroke()
    console.info(`Drawing classicBit @ ${x}, ${y}`)
  }

  toJSON() {
    return {
      type: 'classicBit',
      id: this.id,
      x: this.x,
      y: this.y,
      state: this.state
    }
  }
}
