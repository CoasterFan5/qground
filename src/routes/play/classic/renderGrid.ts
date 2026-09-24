import { ClassicBit } from "#lib/gridItems/classicBit.js";
import { NotGate } from "#lib/gridItems/notGate.js";
import type { GridItem } from "#lib/gridItems/types.js";

const borderWidth = 0.5;

type GridXPosition = number;
type GridYPosition = number;
const items: Record<GridXPosition, Record<GridYPosition, GridItem>> = {
  0: {
    0: new ClassicBit({ id: 'bit-1', x: 0, y: 0 })
  },
  '-1': {
    '-1': new NotGate({ id: 'bit-1', x: -1, y: -1 })
  },
  1: {
    1: new ClassicBit({ id: 'bit-1', x: 0, y: 0 })
  }
};

export const renderGrid = ({ ctx, canvasX, canvasY, width, height, gridSize }: { ctx: CanvasRenderingContext2D, canvasX: number, canvasY: number, width: number, height: number, gridSize: number }) => {
  ctx.strokeStyle = 'gray';
  ctx.lineWidth = 0.125;
  ctx.beginPath();

  // ok so this is very simple we are going to first get the number of squares
  const hSquare2 = Math.ceil((width / gridSize) / 2) + 1
  const vSquare2 = Math.ceil((width / gridSize) / 2) + 1
  const horizontalSquares = hSquare2 + 1 + hSquare2;
  const verticalSquares = vSquare2 + 1 + vSquare2; // this is to ensure its an odd number

  /*
    we need to now calculate the centerOffset
    That is, the # of pixels on the left and top that our grid needs to be pushed back such that all grid squares fit and are centered
  */
  const centerOffsetX = (width - (horizontalSquares * gridSize)) / 2
  const centerOffsetY = (height - (verticalSquares * gridSize)) / 2

  /*
    There is also the fact that the canvas itself can move, if a canvas has shifted by 10px, we need to offset by 10px, but if it has shifted by 50px, we need to offset by 10px still
  */
  const canvasOffsetX = -(canvasX % gridSize)
  const canvasOffsetY = canvasY % gridSize

  const totalOffsetX = centerOffsetX + canvasOffsetX
  const totalOffsetY = centerOffsetY + canvasOffsetY

  // we now need to, based on the cnavas position, determine what the center square is
  const xGridSystemOffset = Math.floor(canvasX / 40);
  const yGridSystemOffset = Math.floor(canvasY / 40);

  // we will now draw every one of those bad boys
  for (let x = -hSquare2; x <= hSquare2 + 1; x += 1) {
    for (let y = -vSquare2; y <= vSquare2 + 1; y += 1) {

      const trueGridSystemX = x + xGridSystemOffset
      const trueGridSystemY = -y + yGridSystemOffset


      const xPos = (x + hSquare2) * gridSize + totalOffsetX
      const yPos = (y + vSquare2) * gridSize + totalOffsetY
      ctx.fillStyle = 'gray'
      ctx.fillRect(xPos, yPos, gridSize, gridSize)
      ctx.fillStyle = 'white'
      if (x == 0 && y == 0) {
        ctx.fillStyle = "green"
      }
      ctx.fillRect(xPos + (borderWidth / 2), yPos + (borderWidth / 2), gridSize - borderWidth, gridSize - borderWidth)

      if (items && items[trueGridSystemX] && items[trueGridSystemX][trueGridSystemY]) {
        const squareData = items[trueGridSystemX][trueGridSystemY]
        squareData.render({
          x: xPos,
          y: yPos,
          ctx: ctx,
        })
      }
    }
  }


  ctx.stroke()
};
