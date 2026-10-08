import type { GridManager } from '../../routes/play/classic/gridManager';

import { GridItem, type RenderData } from './types'

/**
 * Wires can connect to any bits, and will, if there is a positive charge around it, become positive. It can also connect to gates.
 */
export class Wire extends GridItem {

  isOn: boolean = false;

  isWire(): boolean {
    return true
  }

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

  getSignalAtFace() {
    return this.isOn
  }

  updateSignal(gridManager: GridManager): boolean {
    const northItem = gridManager?.getItemAtPosition(this.x, this.y + 1)
    const eastItem = gridManager?.getItemAtPosition(this.x + 1, this.y)
    const southItem = gridManager?.getItemAtPosition(this.x, this.y - 1)
    const westItem = gridManager?.getItemAtPosition(this.x - 1, this.y)

    let newOn = false;
    if (northItem && !northItem.isWire() && northItem.getSignalAtFace("south")) {
      newOn = true;
    }
    if (eastItem && !eastItem.isWire() && eastItem.getSignalAtFace("west")) {
      newOn = true;
    }
    if (southItem && !southItem.isWire() && southItem.getSignalAtFace("north")) {
      newOn = true;
    }
    if (westItem && !westItem.isWire() && westItem.getSignalAtFace("east")) {
      newOn = true;
    }

    if (this.networkId) {
      if (newOn) {
        gridManager.networkManager.setNetworkState(this.networkId, newOn)
      }
      newOn = gridManager.networkManager.getNetworkState(this.networkId) || newOn
    }

    if (this.isOn === newOn) {
      return false;
    } else {
      this.isOn = newOn
      return true
    }
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
