import type { GridManager } from '../../routes/play/classic/gridManager';
import { GridItem, type ConnectedTile, type Face, type RenderData } from './types'

const faces: Face[] = ["north", "east", "south", "west"]

export class WireBridge extends GridItem {
  poweredFaces: Record<Face, boolean> = {
    north: false,
    east: false,
    south: false,
    west: false,
  }

  onClick() {
    return false;
  }

  setNetwork(networkId: string | undefined, face: Face) {
    if (face === "north" || face === "south") {
      this.networkIds.north = networkId
      this.networkIds.south = networkId
    } else {
      this.networkIds.east = networkId
      this.networkIds.west = networkId
    }
  }

  getConnectedTiles(face: Face): ConnectedTile[] {
    if (face === "north" || face === "south") {
      return [
        { x: this.x, y: this.y + 1, face: "south" },
        { x: this.x, y: this.y - 1, face: "north" },
      ]
    }

    return [
      { x: this.x + 1, y: this.y, face: "west" },
      { x: this.x - 1, y: this.y, face: "east" },
    ]
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

    const horizontalOn = this.poweredFaces.east || this.poweredFaces.west
    const verticalOn = this.poweredFaces.north || this.poweredFaces.south
    ctx.fillStyle = horizontalOn ? 'yellow' : 'gray'
    ctx.fillRect(x + 1, y + 15, this.width - 2, 10)
    ctx.fillStyle = verticalOn ? 'orange' : 'black'
    ctx.fillRect(x + 15, y, 10, this.height)
  }

  getSignalAtFace(face: Face) {
    switch (face) {
      case "north":
        return this.poweredFaces.south;
      case "east":
        return this.poweredFaces.west;
      case "south":
        return this.poweredFaces.north;
      case "west":
        return this.poweredFaces.east;
    }
  }

  updateSignal(gridManager: GridManager): boolean {
    let hasChanged = false

    for (const face of faces) {
      const networkId = this.networkIds[face]
      const powered = networkId
        ? gridManager.networkManager.getNetworkState(networkId)
        : false

      if (this.poweredFaces[face] !== powered) {
        this.poweredFaces[face] = powered
        hasChanged = true
      }
    }

    return hasChanged
  }

  toJSON() {
    return {
      type: 'wireBridge' as const,
      x: this.x,
      y: this.y
    }
  }
}
