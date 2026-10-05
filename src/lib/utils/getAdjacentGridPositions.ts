export const getAdjacentGridPositions = (x: number, y: number) => {
  return [{
    x: x + 1,
    y: y
  },
  {
    x: x - 1,
    y: y
  },
  {
    x: x,
    y: y + 1,
  },
  {
    x: x,
    y: y - 1
  }]
}
