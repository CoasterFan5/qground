import type { GridManager } from '../../routes/play/classic/gridManager';
import { GridItem, type Face, type RenderData } from './types'

export class AndGate extends GridItem {

  isOn: boolean = false;

  onClick() {
    return false;
  }

  render({ x, y, gridManager }: RenderData) {
    const ctx = gridManager.getRenderCtx()
    if (!ctx) {
      return
    }
    ctx.beginPath()
    ctx.lineWidth = 2;
    ctx.fillStyle = '#000000'
    ctx.fillRect(x, y, this.width, this.height)
    ctx.fillStyle = '#f1f1f1'
    ctx.fillRect(x + 1, y + 1, this.width - 2, this.height - 2)
    ctx.strokeStyle = this.isOn ? 'orange' : 'black'
    ctx.moveTo(x + 5, y + 0)
    ctx.lineTo(x + 5, y + 10)
    ctx.lineTo(x + 10, y + 10)
    ctx.lineTo(x + 10, y + 30)
    ctx.lineTo(x + 5, y + 30)
    ctx.lineTo(x + 5, y + 40)
    ctx.moveTo(x + 10, y + 10)
    ctx.lineTo(x + 20, y + 10)
    ctx.arc(x + 20, y + 20, 10, -Math.PI / 2, Math.PI / 2)
    ctx.lineTo(x + 10, y + 30)
    ctx.moveTo(x + 30, y + 20)
    ctx.lineTo(x + 40, y + 20)

    ctx.stroke()
  }

  getSignalAtFace(face: Face) {
    if (face == "east") {
      return this.isOn
    }
    return false;
  }

  updateSignal(gridManager: GridManager): boolean {

    const upperTile = gridManager.getItemAtPosition(this.x, this.y + 1)
    const lowerTile = gridManager.getItemAtPosition(this.x, this.y - 1)

    const upperSignal = upperTile?.getSignalAtFace("south") ?? false
    const lowerSignal = lowerTile?.getSignalAtFace("north") ?? false
    const newSignal = upperSignal && lowerSignal

    if (this.isOn !== newSignal) {
      this.isOn = newSignal
      return true
    }
    return false;
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
