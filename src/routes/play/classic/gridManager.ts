import { AndGate } from "#lib/gridItems/andGate.js";
import { ClassicBit } from "#lib/gridItems/classicBit.js";
import { NotGate } from "#lib/gridItems/notGate.js";
import type { GridItem, PositionType } from "#lib/gridItems/types.js";
import { Wire } from "#lib/gridItems/wire.js";
import type { GridData } from "#lib/types/grid.js";
import { NetworkManager } from "./networkManager";
import { renderGridHelper } from "./renderGrid";





export class GridManager {
  gridSize: number = 0;
  canvas: HTMLCanvasElement | undefined = undefined;
  width: number = 0;
  height: number = 0;
  canvasPosition: PositionType = { x: 0, y: 0 }
  cursorPosition: PositionType = { x: 0, y: 0 }
  cursorGridPosition: PositionType | undefined = { x: 0, y: 0 }
  networkManager = new NetworkManager()

  items: GridData = {
    0: {
      0: new ClassicBit()
    },
    1: {
      0: new Wire(),
      1: new Wire(),
      2: new Wire(),
    },
    2: {
      0: new NotGate(),
      2: new NotGate(),
    },
    3: {
      0: new Wire(),
      1: new AndGate(),
      2: new Wire(),
    },
    4: {
      1: new Wire(),
    },
    5: {
      0: new Wire(),
      1: new Wire(),
      2: new Wire()
    },
    6: {
      0: new NotGate(),
      2: new NotGate()
    },
    7: {
      0: new Wire(),
      2: new Wire()
    }
  };

  constructor(gridSize: number) {
    this.gridSize = gridSize
    this.updateGridPositions()
    this.runSimulation()
  }
  updateGridPositions() {
    for (const [gridX, column] of Object.entries(this.items)) {
      for (const [gridY, item] of Object.entries(column)) {
        item.setGridPosition(Number(gridX), Number(gridY))
      }
    }
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
    this.render()
  }

  updateCanvasPosition(callback: (pos: PositionType) => PositionType) {
    this.canvasPosition = { ...callback(this.canvasPosition) }
    this.cursorGridPosition = undefined;
    this.render()
  }

  updateCusorPosition(callback: (pos: PositionType) => PositionType) {
    this.cursorPosition = { ...callback(this.canvasPosition) }
    this.cursorGridPosition = undefined;
    this.render()
  }

  getRenderCtx() {
    return this.canvas?.getContext("2d")
  }

  getCusorGridPosition() {
    if (this.cursorGridPosition) {
      return this.cursorGridPosition
    } else {
      const centeredGridXUnrounded = this.canvasPosition.x / this.gridSize;
      const centeredGridYUnrounded = this.canvasPosition.y / this.gridSize
      // (distance from center / 40) + centeredGrid
      const distanceFromXCenter = (this.cursorPosition.x - (this.width / 2))
      const distanceFromYCenter = -(this.cursorPosition.y - (this.height / 2))
      const mouseGridX = Math.round(distanceFromXCenter / this.gridSize + centeredGridXUnrounded)
      const mouseGridY = Math.round(distanceFromYCenter / this.gridSize + centeredGridYUnrounded)

      this.cursorGridPosition = {
        x: mouseGridX,
        y: mouseGridY
      }
      return this.cursorGridPosition
    }
  }

  resizeCanvas() {
    if (!this.canvas) {
      return
    }

    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.cursorGridPosition = undefined;
    this.render()
  }

  getItemAtPosition(x: number, y: number): GridItem | undefined {
    const item = this.items[x]?.[y];
    return item;
  }

  setItemAtPosition(x: number, y: number, item: GridItem) {
    item.setGridPosition(x, y)
    this.items[x] ??= {}
    this.items[x][y] = item
    this.render()
  }

  onClick(e: MouseEvent) {
    const c = this.getCusorGridPosition()
    const item = this.getItemAtPosition(c.x, c.y)
    if (item?.onClick()) {
      this.render()
      this.runSimulation()
    }
    e.preventDefault()
  }

  runSimulation() {

    let pendingResim = true;
    let iterationCount = 0;
    const maxIterations = 1000;
    this.networkManager.runFloodFill(this)
    while (pendingResim) {
      this.networkManager.updateNetworkStates(this)
      if (iterationCount >= maxIterations) {
        console.warn("iteration count exceeded")
        break
      }
      iterationCount += 1;
      pendingResim = false;
      console.warn(`Pending Resim Reset`)
      for (const xData of Object.entries(this.items)) {
        for (const yData of Object.entries(xData[1])) {
          if (yData[1].updateSignal(this)) {
            console.info(`Resime Triggered by:`)
            console.info(yData[1])
            if (pendingResim) {
              console.info(`But one was already pending`)
            }
            pendingResim = true;
          }

        }
      }
    }
    this.render()
  }

  render = () => {
    renderGridHelper(this)
  }
}
