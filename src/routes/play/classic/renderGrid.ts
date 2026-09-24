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

type RenderGridParams = {
  ctx: CanvasRenderingContext2D;
  canvasX: number;
  canvasY: number;
  width: number;
  height: number;
  gridSize: number;
  cursorPosition: {
    x: number,
    y: number
  }
};

export const renderGrid = ({ ctx, canvasX, canvasY, width, height, gridSize, cursorPosition }: RenderGridParams) => {
  const centerX = width / 2 - gridSize / 2;
  const centerY = height / 2 - gridSize / 2;

  // Include a margin so cells entering the viewport are drawn before they become visible.
  const minGridX = Math.floor((canvasX - width / 2 - gridSize / 2) / gridSize) - 1;
  const maxGridX = Math.ceil((canvasX + width / 2 + gridSize / 2) / gridSize) + 1;
  const minGridY = Math.floor((canvasY - height / 2 - gridSize / 2) / gridSize) - 1;
  const maxGridY = Math.ceil((canvasY + height / 2 + gridSize / 2) / gridSize) + 1;
  const centeredGridXUnrounded = canvasX / gridSize;
  const centeredGridYUnrounded = canvasY / gridSize
  const centeredGridX = Math.round(centeredGridXUnrounded);
  const centeredGridY = Math.round(centeredGridYUnrounded);


  // (distance from center / 40) + centeredGrid
  const distanceFromXCenter = (cursorPosition.x - (width / 2))
  const distanceFromYCenter = -(cursorPosition.y - (height / 2))
  const mouseGridX = Math.round(distanceFromXCenter / gridSize + centeredGridXUnrounded)
  const mouseGridY = Math.round(distanceFromYCenter / gridSize - centeredGridYUnrounded)

  for (let gridX = minGridX; gridX <= maxGridX; gridX += 1) {
    for (let gridY = minGridY; gridY <= maxGridY; gridY += 1) {
      // Grid cells are centered on the canvas origin; floor to keep edges pixel-aligned.
      const x = Math.floor(centerX + gridX * gridSize - canvasX);
      const y = Math.floor(centerY - gridY * gridSize + canvasY);

      ctx.fillStyle = 'gray';
      ctx.fillRect(x, y, gridSize, gridSize);
      ctx.fillStyle = gridX === centeredGridX && gridY === centeredGridY ? 'green' : 'white';
      ctx.fillRect(
        x + borderWidth / 2,
        y + borderWidth / 2,
        gridSize - borderWidth,
        gridSize - borderWidth
      );

      if (mouseGridX == gridX && mouseGridY == gridY) {
        ctx.fillStyle = "#DFDFDF"
        ctx.fillRect(
          x + borderWidth / 2,
          y + borderWidth / 2,
          gridSize - borderWidth,
          gridSize - borderWidth
        );
      }

      const item = items[gridX]?.[gridY];
      item?.render({ x, y, ctx });
    }
  }
};
