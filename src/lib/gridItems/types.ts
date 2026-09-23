import type { NotGateItem } from "./notGate"

export type CanvasData = {
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
}


export type BaseGridItem = {
  id: string,
  x: number,
  y: number,
}

export type ClassicBitItem = BaseGridItem & {
  type: 'classicBit',
  state: 0 | 1,
}


export type GridItem = ClassicBitItem | NotGateItem

export type GridItemHandler<T extends GridItem = GridItem> = {
  renderer: (item: T, canvasData: CanvasData) => void,
  onClick: (item: T) => void;
}

export type GridItemMap = {
  'classicBit': ClassicBitItem,
  'notGate': NotGateItem,
}
