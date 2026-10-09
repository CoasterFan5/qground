import type { GridManager } from "../../routes/play/classic/gridManager"

export type RenderData = {
  gridManager: GridManager,
  x: number,
  y: number,
}

export const placeables = ['classicBit', 'wire', 'notGate', 'andGate', 'orGate', 'xOrGate', 'wireBridge', 'delete'] as const;
export type Placeable = (typeof placeables)[number]

export type Face = "north" | "east" | "south" | "west"

export type PositionType = {
  x: number,
  y: number
}

export type ConnectedTile = {
  x: number,
  y: number,
  face: Face,
}

export abstract class GridItem {
  id?: string
  x: number = 0
  y: number = 0
  width: number
  height: number
  networkIds: Partial<Record<Face, string>> = {}

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

  getConnectedTiles(face: Face): ConnectedTile[] {
    void face // here for types
    return []
  }

  /**
   * This should **ONLY** be used for wires, but is available on all items for funzies
   */
  setNetwork(networkId: string | undefined, face: Face) {
    this.networkIds[face] = networkId
  }

  abstract render(params: RenderData): void

  /** Return true when a click changes this item's state and should trigger a re-sim. */
  abstract onClick(): boolean

  /* Get the signal at a specific face of the gate */
  abstract getSignalAtFace(face: Face): boolean

  /* Return true if state has changed, so we can trigger a re-sim */
  abstract updateSignal(gridManager: GridManager): boolean

  abstract toJSON(): {
    type: Placeable,
    x: number,
    y: number,
    state?: object
  }
}
