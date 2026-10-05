import type { GridManager } from "../routes/play/classic/gridManager";
import { Wire } from "./gridItems/wire";
import { getId } from "./types/idManager";
import { getAdjacentGridPositions } from "./utils/getAdjacentGridPositions";

export class SimulationManager {
  gridManager: GridManager;
  constructor(gridManager: GridManager) {
    this.gridManager = gridManager
    this.findNets();
  }

  private findNets() {
    // loop through the grid data

    const skips = new Set<string>()
    const nets: Record<string, Array<{ x: number, y: number }>> = {}

    const processSquare = (xPos: number, yPos: number, parentNetId: string | undefined) => {
      const id = `${xPos}-${yPos}`
      if (skips.has(id)) {
        return;
      }
      skips.add(id)
      const item = this.gridManager.getItemAtPosition(xPos, yPos)
      if (item instanceof Wire) {
        if (parentNetId == undefined) {
          parentNetId = getId()
          nets[parentNetId] = []
        }
        nets[parentNetId].push({ x: xPos, y: yPos })
        const positions = getAdjacentGridPositions(xPos, yPos)
        for (const position of positions) {
          processSquare(position.x, position.y, parentNetId)
        }
      }
    }

    const grid = this.gridManager.items;
    for (const [xPos, xData] of Object.entries(grid)) {
      for (const [yPos] of Object.entries(xData)) {
        processSquare(parseInt(xPos), parseInt(yPos), undefined)
        console.log(nets)
      }
    }
  }

  private buildRelationshipMap() {
    // first, assign everything to a
  }
}
