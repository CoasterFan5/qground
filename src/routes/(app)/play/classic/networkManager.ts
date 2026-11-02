import type { GridItem } from "#lib/gridItems/types.js";
import { getSurroundingFaceList } from "#lib/utils/getSurroundingFaceList.js";
import type { Face } from "#lib/gridItems/types.js";
import type { GridManager } from "./gridManager";

const faces: Face[] = ["north", "east", "south", "west"]

function oppositeFace(face: Face): Face {
  switch (face) {
    case "north": return "south"
    case "east": return "west"
    case "south": return "north"
    case "west": return "east"
  }
}

function getChannelKey(gridItem: GridItem, face: Face) {
  return gridItem.getConnectedTiles(face)
    .map(({ x, y, face: neighborFace }) => `${x}-${y}:${neighborFace}`)
    .sort()
    .join("|")
}

export class NetworkManager {
  networks: Record<string, boolean> = {}
  private iter = 0

  createNetwork() {
    this.iter += 1
    const id = this.iter.toString(16)
    this.networks[id] = false
    return id
  }

  setNetworkState(id: string, powered: boolean) {
    this.networks[id] = powered
  }

  getNetworkState(id: string) {
    return this.networks[id] ?? false
  }

  runFloodFill(gridManager: GridManager) {
    this.networks = {}
    this.iter = 0

    for (const column of Object.values(gridManager.items)) {
      for (const gridItem of Object.values(column)) {
        for (const face of faces) {
          gridItem.setNetwork(undefined, face)
        }
      }
    }

    const visited = new Set<string>()
    for (const column of Object.values(gridManager.items)) {
      for (const gridItem of Object.values(column)) {
        for (const face of faces) {
          if (gridItem.getConnectedTiles(face).length === 0) {
            continue
          }

          const key = `${gridItem.x}-${gridItem.y}:${getChannelKey(gridItem, face)}`
          if (visited.has(key)) {
            continue
          }

          this.parseWireTile({
            gridItem,
            face,
            gridManager,
            networkId: this.createNetwork(),
            visited,
          })
        }
      }
    }
  }

  updateNetworkStates(gridManager: GridManager) {
    for (const networkId of Object.keys(this.networks)) {
      this.networks[networkId] = false
    }

    for (const column of Object.values(gridManager.items)) {
      for (const gridItem of Object.values(column)) {
        const surroundingTiles = getSurroundingFaceList(gridItem.x, gridItem.y)
        for (const tile of surroundingTiles) {
          const networkFace = oppositeFace(tile.face)
          const networkId = gridItem.networkIds[networkFace]
          if (!networkId) {
            continue
          }

          const adjacentItem = gridManager.getItemAtPosition(tile.x, tile.y)
          if (!adjacentItem || adjacentItem.networkIds[tile.face]) {
            continue
          }

          if (adjacentItem.getSignalAtFace(tile.face)) {
            this.networks[networkId] = true
          }
        }
      }
    }
  }

  private parseWireTile({
    gridItem,
    face,
    gridManager,
    networkId,
    visited,
  }: {
    gridItem: GridItem | undefined,
    face: Face,
    gridManager: GridManager,
    networkId: string,
    visited: Set<string>,
  }) {
    if (!gridItem) {
      return
    }

    const connectedTiles = gridItem.getConnectedTiles(face)
    if (connectedTiles.length === 0) {
      return
    }

    const key = `${gridItem.x}-${gridItem.y}:${getChannelKey(gridItem, face)}`
    if (visited.has(key)) {
      return
    }
    visited.add(key)
    gridItem.setNetwork(networkId, face)

    for (const tile of connectedTiles) {
      const adjacentItem = gridManager.getItemAtPosition(tile.x, tile.y)
      if (!adjacentItem) {
        continue
      }

      this.parseWireTile({
        gridItem: adjacentItem,
        face: tile.face,
        gridManager,
        networkId,
        visited,
      })
    }
  }
}
