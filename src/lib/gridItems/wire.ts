import type { GridManager } from '../../routes/play/classic/gridManager';

import { GridItem, type RenderData } from './types'

/**
 * Wires can connect to any bits, and will, if there is a positive charge around it, become positive. It can also connect to gates.
 */
export class Wire extends GridItem {

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
    if (this.isOn) {
      ctx.fillStyle = "orange"
    } else {
      ctx.fillStyle = 'black'
    }
    ctx.fillRect(x + 15, y + 15, 10, 10)
    if (gridManager.getItemAtPosition(this.x - 1, this.y)) {
      ctx.fillRect(x, y + 15, 15, 10)
    }
    if (gridManager.getItemAtPosition(this.x + 1, this.y)) {
      ctx.fillRect(x + 25, y + 15, 15, 10)
    }
    if (gridManager.getItemAtPosition(this.x, this.y + 1)) {
      ctx.fillRect(x + 15, y, 10, 15)
    }
    if (gridManager.getItemAtPosition(this.x, this.y - 1)) {
      ctx.fillRect(x + 15, y + 25, 10, 15)
    }
    ctx.stroke()
  }

  parseUpdates({ gridX, gridY, gridManager }: { gridX: number, gridY: number, gridManager: GridManager }): boolean {
    const wasOn = this.isOn
    this.isOn = gridManager.getWireNetworkSignal(gridX, gridY)
    return this.isOn !== wasOn
  }

  getSignal() {
    return this.isOn
  }

  isSignalConduit() {
    return true
  }

  isSignalSource() {
    return false
  }

  resetSignal() {
    const wasOn = this.isOn
    this.isOn = false
    return wasOn
  }

  toJSON() {
    return {
      type: 'classicBit',
      id: this.id,
      x: this.x,
      y: this.y,
      isOn: this.isOn
    }
  }
}
