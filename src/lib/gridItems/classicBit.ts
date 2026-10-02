import { GridItem, type RenderData } from './types'

export class ClassicBit extends GridItem {
  state: 0 | 1 = 0

  onClick() {
    this.state = this.state === 0 ? 1 : 0
    return true;
  }

  render({ x, y, gridManager }: RenderData) {
    const ctx = gridManager.getRenderCtx()
    if (!ctx) {
      return
    }
    ctx.beginPath()
    if (this.state == 0) {
      ctx.fillStyle = 'black'
    } else {
      ctx.fillStyle = "orange"
    }
    ctx.fillRect(x, y, this.width, this.height)
    ctx.fillStyle = 'black'
    ctx.fillRect(x + 3, y + 3, this.width - 6, this.height - 6)
    ctx.stroke()
  }

  getSignal() {
    return this.state === 1
  }

  isSignalSource() {
    return this.getSignal()
  }

  resetSignal() {
    return false
  }

  parseUpdates(): boolean {
    return false;
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
