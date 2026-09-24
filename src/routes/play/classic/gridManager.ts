import { ClassicBit } from "#lib/gridItems/classicBit.js";
import { NotGate } from "#lib/gridItems/notGate.js";
import type { GridItem } from "#lib/gridItems/types.js";
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
      0: new ClassicBit({ id: 'bit-1', x: 0, y: 0 })
    },
    '-1': {
      '-1': new NotGate({ id: 'bit-1', x: -1, y: -1 })
    },
    1: {
      1: new ClassicBit({ id: 'bit-1', x: 0, y: 0 })
    }
  };

  constructor(gridSize: number) {
    this.gridSize = gridSize
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

  onClick(e: MouseEvent) {
    e.preventDefault()
    const c = this.getCusorGridPosition()
    const item = this.getItemAtPosition(c.x, c.y)
    item?.onClick()
    this.render()
  }

  render = () => {
    renderGridHelper(this)
  }
}
