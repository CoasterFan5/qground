import { gridItemHandlers } from "./gridItems";
import type { GridItem } from "./types";

export const gridClickHandler = (item: GridItem) => {
  switch (item.type) {
    case 'classicBit': {
      gridItemHandlers.classicBit.onClick(item)
      break;
    }
    case 'notGate': {
      gridItemHandlers.notGate.onClick(item)
      break
    }
  }
}
