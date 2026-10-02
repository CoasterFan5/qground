import type { GridManager } from "../../routes/play/classic/gridManager"

export type RenderData = {
  gridManager: GridManager,
  x: number,
  y: number,
}

export abstract class GridItem {
  id?: string
  x: number = 0
  y: number = 0
  width: number
  height: number

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

  abstract render(params: RenderData): void
  /** Return true when a click changes this item's state and should start propagation. */
  abstract onClick(): boolean
  abstract toJSON(): object
  /** Return this item's current output signal, not whether one of its inputs is active. */
  abstract getSignal(): boolean
  /** Wires override this to participate in a shared conductive network. */
  isSignalConduit(): boolean {
    return false
  }
  /** Return true if this signal can reach the requested cardinal neighbor. */
  canPowerNeighbor(targetX: number, targetY: number): boolean {
    return this.getSignal() && (targetX !== this.x || targetY !== this.y)
  }
  /** Request one initial parse when the GridManager is constructed. */
  shouldUpdateInitially(): boolean {
    return false
  }
  /** Identify an independent source that remains active while derived signals are reset. */
  abstract isSignalSource(): boolean
  /** Clear derived output during a connected-circuit rebuild; return true if output changed. */
  abstract resetSignal(): boolean
  /**
   * Recompute output from inputs. Return true only when output changes; the manager then
   * schedules this item's cardinal neighbors for the next synchronous update wave.
   */
  abstract parseUpdates(args: { gridX: number, gridY: number, gridManager: GridManager }): boolean
}
