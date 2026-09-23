import { notGateHandler } from "./notGate"
import { type ClassicBitItem, type GridItem, type GridItemHandler, type GridItemMap } from "./types";



const registerGridHandler = <T extends GridItem>(handler: GridItemHandler<T>) => {
  return handler
}

type GridItemHandlerMap = {
  [K in keyof GridItemMap]: GridItemHandler<GridItemMap[K]>
}

export const gridItemHandlers: GridItemHandlerMap = {
  'classicBit': registerGridHandler<ClassicBitItem>({
    onClick: (c) => {
      if (c.state == 0) {
        c.state = 1
      } else {
        c.state = 0
      }
    },
    renderer: ({ x, y }, { ctx }) => {
      const width = 10;
      const xOffset = width / 2;
      const height = 10;
      const yOffset = height / 2;
      ctx.fillStyle = "black"
      ctx.fillRect(x - xOffset, y - yOffset, width, height)
    },
  }),
  'notGate': notGateHandler
}
