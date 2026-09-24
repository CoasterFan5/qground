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
    ctx.fillRect(x, y, this.width, this.height)
    ctx.stroke()
  }

  parseUpdates({ gridX, gridY, gridManager }: { gridX: number, gridY: number, gridManager: GridManager }): boolean {
    const wasOn = this.isOn
    let hasPoweredNeighbor = false

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (Math.abs(x) + Math.abs(y) !== 1) {
          continue
        }

        const item = gridManager.getItemAtPosition(gridX + x, gridY + y)
        if (item?.canPowerNeighbor(gridX, gridY)) {
          hasPoweredNeighbor = true
        }
      }
    }

    this.isOn = hasPoweredNeighbor
    return this.isOn !== wasOn
  }

  getSignal() {
    return this.isOn
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
