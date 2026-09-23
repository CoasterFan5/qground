import { gridItemHandlers } from "./gridItems";
import type { CanvasData, GridItem } from "./types";

export const gridRenderHandler = (item: GridItem, canvasData: CanvasData) => {
  switch (item.type) {
    case 'classicBit': {
      gridItemHandlers.classicBit.renderer(item, canvasData)
      break;
    }
    case 'notGate': {
      gridItemHandlers.notGate.renderer(item, canvasData)
      break
    }
  }
}
