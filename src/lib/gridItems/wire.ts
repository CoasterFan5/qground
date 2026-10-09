import type { GridManager } from '../../routes/play/classic/gridManager';

import { GridItem, type ConnectedTile, type Face, type RenderData } from './types'

/**
 * Wires can connect to any bits, and will, if there is a positive charge around it, become positive. It can also connect to gates.
 */
export class Wire extends GridItem {

  isOn: boolean = false;

  isWire(): boolean {
    return true
  }

  setNetwork(networkId: string | undefined, face: Face) {
    this.networkIds[face] = networkId
    for (const connectedFace of ["north", "east", "south", "west"] as const) {
      if (connectedFace !== face) {
        this.networkIds[connectedFace] = networkId
      }
    }
  }

  getConnectedTiles(face: Face): ConnectedTile[] {
    void face
    return [
      { x: this.x, y: this.y + 1, face: "south" },
      { x: this.x + 1, y: this.y, face: "west" },
      { x: this.x, y: this.y - 1, face: "north" },
      { x: this.x - 1, y: this.y, face: "east" },
    ]
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
    const networkId = this.networkIds.north
    const newOn = networkId
      ? gridManager.networkManager.getNetworkState(networkId)
      : false

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
