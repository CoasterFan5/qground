import { GridItem, type RenderData } from './types'

export class ClassicBit extends GridItem {
  state: 0 | 1 = 0

  onClick() {
    this.state = this.state === 0 ? 1 : 0
  }

  render({ x, y, ctx }: RenderData) {
    ctx.beginPath()
    if (this.state == 0) {
      ctx.fillStyle = 'black'
    } else {
      ctx.fillStyle = "yellow"
    }
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
