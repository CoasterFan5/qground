import type { GridManager } from '../../routes/play/classic/gridManager';
import { GridItem, type Face, type RenderData } from './types'

export class WireBridge extends GridItem {

  isVerticalOn: boolean = false;
  isHorizontalOn: boolean = false;

  onClick() {
    // No-op for NOT gates
    return false;
  }

  isWire(): boolean {
    return true;
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



    ctx.fillStyle = this.isHorizontalOn ? 'yellow' : 'gray'
    ctx.fillRect(x + 1, y + 15, this.width - 2, 10)

    ctx.fillStyle = this.isVerticalOn ? 'orange' : 'black'
    ctx.fillRect(x + 15, y, 10, this.height)




  }

  getSignalAtFace(face: Face) {
    if (face == "east" || face == 'west') {
      return this.isHorizontalOn;
    } else if (face == "north" || face == 'south') {
      return this.isVerticalOn;
    }
    return false;
  }

  updateSignal(gridManager: GridManager) {
    const left = gridManager.getItemAtPosition(this.x - 1, this.y)?.getSignalAtFace("east") ?? false;
    const right = gridManager.getItemAtPosition(this.x + 1, this.y)?.getSignalAtFace("west") ?? false;
    const top = gridManager.getItemAtPosition(this.x, this.y + 1)?.getSignalAtFace("south") ?? false;
    const bottom = gridManager.getItemAtPosition(this.x, this.y - 1)?.getSignalAtFace("north") ?? false;

    const newHorizontalOn = left || right
    if (newHorizontalOn !== this.isHorizontalOn) {
      this.isHorizontalOn = newHorizontalOn
      return true;
    }

    const newVerticalOn = top || bottom
    if (newVerticalOn !== this.isVerticalOn) {
      this.isVerticalOn = newVerticalOn
      return true;
    }

    return false;
  }

  toJSON() {
    return {
      type: 'wireBridge',
      id: this.id,
      x: this.x,
      y: this.y
    }
  }
}
