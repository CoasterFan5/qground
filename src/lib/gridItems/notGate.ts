import type { GridManager } from '../../routes/play/classic/gridManager';
import { GridItem, type Face, type RenderData } from './types'

export class NotGate extends GridItem {

  isOn: boolean = false;

  onClick() {
    // No-op for NOT gates
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

    if (this.isOn) {
      ctx.strokeStyle = "orange"
    } else {
      ctx.strokeStyle = 'black'
    }
    ctx.moveTo(x + 5, y + 5)
    ctx.lineTo(x + 5, y + 35)
    ctx.lineTo(x + 20, y + 20)
    ctx.lineTo(x + 5, y + 5)
    ctx.moveTo(x + 30, y + 20)
    ctx.arc(x + 25, y + 20, 5, 0, Math.PI * 2)
    ctx.stroke()
  }

  getSignalAtFace(face: Face) {
    if (face == "east") {
      return this.isOn;
    } else {
      return false;
    }
  }

  updateSignal(gridManager: GridManager) {
    const i1 = gridManager.getItemAtPosition(this.x - 1, this.y)
    const s1 = i1?.getSignalAtFace('east') ?? false
    if (this.isOn == !s1) {
      return false;
    } else {
      this.isOn = !s1
      return true
    }
  }

  toJSON() {
    return {
      type: 'notGate' as const,
      x: this.x,
      y: this.y
    }
  }
}
