import { GridItem, type RenderData } from './types'

export class NotGate extends GridItem {
  onClick() {
    // No-op for NOT gates
  }

  render({ x, y, ctx }: RenderData) {
    ctx.beginPath()
    ctx.lineWidth = 2;
    ctx.fillStyle = '#000000'
    ctx.fillRect(x, y, this.width, this.height)
    ctx.fillStyle = '#f1f1f1'
    ctx.fillRect(x + 1, y + 1, this.width - 2, this.height - 2)

    ctx.strokeStyle = 'black'
    ctx.moveTo(x + 5, y + 5)
    ctx.lineTo(x + 5, y + 35)
    ctx.lineTo(x + 20, y + 20)
    ctx.lineTo(x + 5, y + 5)
    ctx.moveTo(x + 30, y + 20)
    ctx.arc(x + 25, y + 20, 5, 0, Math.PI * 2)
    ctx.stroke()
  }

  toJSON() {
    return {
      type: 'notGate',
      id: this.id,
      x: this.x,
      y: this.y
    }
  }
}
