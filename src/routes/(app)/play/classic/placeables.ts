import { AndGate } from "#lib/gridItems/andGate.js";
import { ClassicBit } from "#lib/gridItems/classicBit.js";
import { NotGate } from "#lib/gridItems/notGate.js";
import { OrGate } from "#lib/gridItems/orGate.js";
import { GridItem, type Placeable } from "#lib/gridItems/types.js";
import { Wire } from "#lib/gridItems/wire.js";
import { WireBridge } from "#lib/gridItems/wireBridge.js";
import { XOrGate } from "#lib/gridItems/xOrGate.js";


export const placeableDetails: Record<
  Placeable,
  {
    displayName: string,
    builder: () => GridItem | undefined
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
  },
  andGate: {
    displayName: "And Gate",
    builder: () => {
      return new AndGate()
    }
  },
  'orGate': {
    displayName: "Or Gate",
    builder: () => {
      return new OrGate()
    }
  },
  xOrGate: {
    displayName: "XOr Gate",
    builder: () => {
      return new XOrGate()
    }
  },
  'wireBridge': {
    displayName: "Wire Bridge",
    builder: () => {
      return new WireBridge()
    }
  },
  'delete': {
    displayName: "delete",
    builder: () => {
      return undefined
    }
  }
}
