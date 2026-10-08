import type { Face } from "#lib/gridItems/types.js";

export const getSurroundingFaceList: (xPos: number, yPos: number) => { x: number, y: number, face: Face }[] = (xPos, yPos) => {
  return [
    { x: xPos, y: yPos + 1, face: 'south' },
    { x: xPos + 1, y: yPos, face: "west" },
    { x: xPos, y: yPos - 1, face: "north" },
    { x: xPos - 1, y: yPos, face: "east" }
  ]
}
