import { ClassicBit } from "#lib/gridItems/classicBit.js";
import { NotGate } from "#lib/gridItems/notGate.js";
import type { GridItem } from "#lib/gridItems/types.js";
import { Wire } from "#lib/gridItems/wire.js";

export const placeables = ['classicBit', 'wire', 'notGate'] as const;
export type Placeable = (typeof placeables)[number]
export const placeableDetails: Record<
  Placeable,
  {
    displayName: string,
    builder: () => GridItem
  }
> = {
  classicBit: {
    displayName: "Bit",
    builder: () => {
      return new ClassicBit()
    }
  },
  wire: {
    displayName: "Wire",
    builder: () => {
      return new Wire()
    }
  },
  notGate: {
    displayName: "Not Gate",
    builder: () => {
      return new NotGate()
    }
  }
}
