import { AndGate } from "#lib/gridItems/AndGate.js";
import { ClassicBit } from "#lib/gridItems/classicBit.js";
import { NotGate } from "#lib/gridItems/notGate.js";
import type { GridItem } from "#lib/gridItems/types.js";
import { Wire } from "#lib/gridItems/wire.js";
import { renderGridHelper } from "./renderGrid";

type PositionType = {
  x: number,
  y: number
}
type GridXPosition = number;
type GridYPosition = number;

export class GridManager {
  gridSize: number = 0;
  canvas: HTMLCanvasElement | undefined = undefined;
  width: number = 0;
  height: number = 0;
  canvasPosition: PositionType = { x: 0, y: 0 }
  cursorPosition: PositionType = { x: 0, y: 0 }
  cursorGridPosition: PositionType | undefined = { x: 0, y: 0 }

  items: Record<GridXPosition, Record<GridYPosition, GridItem>> = {
    0: {
      0: new ClassicBit()
    },
    1: {
      0: new Wire()
    },
    2: {
      0: new NotGate()
    },
    3: {
      0: new Wire(),
      '-1': new AndGate(),
      '-2': new ClassicBit()
    },
    4: {
      '-1': new Wire()
    },
    5: {
      "-1": new Wire(),
      0: new Wire(),
    }

  };

  constructor(gridSize: number) {
    this.gridSize = gridSize
    this.updateGridPositions()
    const initialUpdates = Object.entries(this.items).flatMap(([gridX, column]) =>
      Object.entries(column).flatMap(([gridY, item]) =>
        item.shouldUpdateInitially() ? [{ x: Number(gridX), y: Number(gridY) }] : []
      )
    )
    this.processUpdateQueue(initialUpdates)

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
  }

  onClick(e: MouseEvent) {
    e.preventDefault()
    const c = this.getCusorGridPosition()
    const item = this.getItemAtPosition(c.x, c.y)
    if (item?.onClick()) {
      this.updateHandler(c.x, c.y)
    } else {
      this.render()
    }
  }

  updateHandler(changedX: number, changedY: number) {
    const startPositions = this.getAdjacentUpdatePositions(changedX, changedY)
    const changedItem = this.getItemAtPosition(changedX, changedY)

    if (changedItem) {
      // Rebuild this connected circuit on either source transition so wire branches cannot keep stale power alive.
      const connectedItems = this.getConnectedUpdatePositions(changedX, changedY)
      const resetItems: PositionType[] = []

      for (const position of connectedItems) {
        const item = this.getItemAtPosition(position.x, position.y)
        if (item?.resetSignal()) {
          resetItems.push(position)
        }
      }

      for (const position of resetItems) {
        startPositions.push(position, ...this.getAdjacentUpdatePositions(position.x, position.y))
      }

      for (const position of connectedItems) {
        const item = this.getItemAtPosition(position.x, position.y)
        if (item?.isSignalSource()) {
          startPositions.push(...this.getAdjacentUpdatePositions(position.x, position.y))
        }
      }
    }

    this.processUpdateQueue(startPositions)
    this.render()
  }

  private processUpdateQueue(startPositions: PositionType[]) {
    const pending = new Set<string>()
    const enqueue = (target: PositionType[], positions: PositionType[]) => {
      for (const position of positions) {
        const key = `${position.x},${position.y}`
        if (!pending.has(key)) {
          pending.add(key)
          target.push(position)
        }
      }
    }

    let currentTick: PositionType[] = []
    enqueue(currentTick, startPositions)
    let processedItems = 0

    while (currentTick.length > 0) {
      const nextTick: PositionType[] = []

      for (const { x, y } of currentTick) {
        pending.delete(`${x},${y}`)
        processedItems += 1
        if (processedItems > 10_000) {
          console.warn('Signal update stopped after reaching the processing limit.')
          return
        }

        const item = this.getItemAtPosition(x, y)
        if (!item?.parseUpdates({ gridX: x, gridY: y, gridManager: this })) {
          continue
        }

        enqueue(nextTick, this.getAdjacentUpdatePositions(x, y))
      }
      currentTick = nextTick
    }
  }


  private getConnectedUpdatePositions(x: number, y: number): PositionType[] {
    const connected: PositionType[] = []
    const visited = new Set<string>()
    const pending = [{ x, y }]

    while (pending.length > 0) {
      const position = pending.pop()!
      const key = `${position.x},${position.y}`
      if (visited.has(key) || !this.getItemAtPosition(position.x, position.y)) {
        continue
      }

      visited.add(key)
      connected.push(position)
      pending.push(...this.getAdjacentUpdatePositions(position.x, position.y))
    }

    return connected
  }

  private getAdjacentUpdatePositions(x: number, y: number): PositionType[] {
    const positions: PositionType[] = []

    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      for (let offsetY = -1; offsetY <= 1; offsetY++) {
        if (Math.abs(offsetX) + Math.abs(offsetY) !== 1) {
          continue
        }

        const gridX = x + offsetX
        const gridY = y + offsetY
        if (this.getItemAtPosition(gridX, gridY)) {
          positions.push({ x: gridX, y: gridY })
        }
      }
    }

    return positions
  }

  render = () => {
    renderGridHelper(this)
  }
}
