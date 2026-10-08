import type { GridItem } from "#lib/gridItems/types.js";
import { getSurroundingFaceList } from "#lib/utils/getSurroundingFaceList.js";
import type { GridManager } from "./gridManager";

export class NetworkManager {
  networks: Record<string, boolean> = {}
  private iter = 0

  constructor() {
    this.networks = {}
  }

  createNetwork() {
    this.iter += 1;
    this.networks[this.iter.toString(16)] = false;
    return this.iter.toString(16)
  }

  setNetworkState(id: string, powered: boolean) {
    this.networks[id] = powered
  }

  getNetworkState(id: string) {
    return this.networks[id] ?? false
  }

  runFloodFill(gridManager: GridManager) {
    const avoids = new Set<string>()
    for (const xData of Object.entries(gridManager.items)) {
      for (const yData of Object.entries(xData[1])) {
        NetworkManager.parseWireTile({
          gridItem: yData[1],
          gridManager,
          networkId: this.createNetwork(),
          avoids,
        })
      }
    }
  }

  updateNetworkStates(gridManager: GridManager) {
    // set all networks to unpowered before we recompute
    for (const [networkId] of Object.entries(this.networks)) {
      this.networks[networkId] = false;
    }

    for (const [xPosString, xData] of Object.entries(gridManager.items)) {
      for (const [yPosString, gridItem] of Object.entries(xData)) {
        if (gridItem.isWire() && gridItem.networkId) {
          // check surrounding power sources
          //
          const sfList = getSurroundingFaceList(parseInt(xPosString), parseInt(yPosString))
          for (const item of sfList) {
            const gi2 = gridManager.getItemAtPosition(item.x, item.y)
            if (gi2) {
              if (!gi2.isWire() && gi2.getSignalAtFace(item.face)) {
                this.networks[gridItem.networkId] = true;
              }
            }
          }
        }
      }
    }

  }

  private static parseWireTile({ gridItem, gridManager, networkId, avoids }: { gridItem: GridItem | undefined, gridManager: GridManager, networkId: string, avoids: Set<string> }) {
    if (!gridItem) {
      return
    }

    const key = `${gridItem.x}-${gridItem.y}`
    if (avoids.has(key)) {
      return
    }
    avoids.add(key)
    if (gridItem.isWire()) {
      gridItem.setNetwork(networkId)
      // get the gridItem around
      const tile1 = gridManager.getItemAtPosition(gridItem.x, gridItem.y + 1)
      const tile2 = gridManager.getItemAtPosition(gridItem.x + 1, gridItem.y)
      const tile3 = gridManager.getItemAtPosition(gridItem.x, gridItem.y - 1)
      const tile4 = gridManager.getItemAtPosition(gridItem.x - 1, gridItem.y)
      if (
        tile1?.getSignalAtFace("south") && !tile1.isWire()
      ) {
        gridManager.networkManager.setNetworkState(networkId, true)
      }
      this.parseWireTile({ gridItem: tile1, gridManager, networkId, avoids })
      this.parseWireTile({ gridItem: tile2, gridManager, networkId, avoids })
      this.parseWireTile({ gridItem: tile3, gridManager, networkId, avoids })
      this.parseWireTile({ gridItem: tile4, gridManager, networkId, avoids })
    }
  }
}
