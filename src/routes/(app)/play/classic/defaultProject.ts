import type { Placeable } from "#lib/gridItems/types.js"

export const defaultProject: {
  "version": string,
  items: {
    type: Placeable,
    x: number,
    y: number
  }[]
} = {
  "version": "1",
  "items": [
    {
      "type": "classicBit",
      "x": 0,
      "y": 0
    },
    {
      "type": "classicBit",
      "x": 0,
      "y": 2
    },
    {
      "type": "wire",
      "x": 1,
      "y": 0
    },
    {
      "type": "wire",
      "x": 1,
      "y": 2
    },
    {
      "type": "wireBridge",
      "x": 2,
      "y": 0
    },
    {
      "type": "wire",
      "x": 2,
      "y": 1
    },
    {
      "type": "wire",
      "x": 2,
      "y": 2
    },
    {
      "type": "wire",
      "x": 2,
      "y": -2
    },
    {
      "type": "wire",
      "x": 2,
      "y": -1
    },
    {
      "type": "wire",
      "x": 3,
      "y": 0
    },
    {
      "type": "wire",
      "x": 3,
      "y": 2
    },
    {
      "type": "wire",
      "x": 3,
      "y": -2
    },
    {
      "type": "wire",
      "x": 4,
      "y": 0
    },
    {
      "type": "xOrGate",
      "x": 4,
      "y": 1
    },
    {
      "type": "wire",
      "x": 4,
      "y": 2
    },
    {
      "type": "wire",
      "x": 4,
      "y": -2
    },
    {
      "type": "andGate",
      "x": 4,
      "y": -1
    },
    {
      "type": "wire",
      "x": 5,
      "y": 1
    },
    {
      "type": "wire",
      "x": 5,
      "y": -1
    },
    {
      "type": "wire",
      "x": 6,
      "y": -1
    }
  ]
}
