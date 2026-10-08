import type { GridManager } from "../../routes/play/classic/gridManager"

export type RenderData = {
  gridManager: GridManager,
  x: number,
  y: number,
}

export type Face = "north" | "east" | "south" | "west"

export type PositionType = {
  x: number,
  y: number
}

export abstract class GridItem {
  id?: string
  x: number = 0
  y: number = 0
  width: number
  height: number
  networkId: string | undefined = undefined

  constructor() {
    this.width = 40
    this.height = 40
  }

  setGridPosition(x: number, y: number) {
    this.x = x
    this.y = y
  }

  setHeight(height: number) {
    this.height = height
  }

  setWidth(width: number) {
    this.width = width
  }

  /* we can just override this for wires */
  isWire() {
    return false
  }

  /**
   * This should **ONLY** be used for wires, but is available on all items for funzies
   */
  setNetwork(networkId: string | undefined) {
    this.networkId = networkId;
  }

  abstract render(params: RenderData): void

  /** Return true when a click changes this item's state and should trigger a re-sim. */
  abstract onClick(): boolean

  /* Get the signal at a specific face of the gate */
  abstract getSignalAtFace(face: Face): boolean

  /* Return true if state has changed, so we can trigger a re-sim */
  abstract updateSignal(gridManager: GridManager): boolean

  abstract toJSON(): object
}
