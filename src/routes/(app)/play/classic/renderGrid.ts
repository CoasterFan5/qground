import type { GridManager } from "./gridManager";

const borderWidth = 0.5;

export const renderGridHelper = (gridManager: GridManager) => {

  const ctx = gridManager.getRenderCtx()
  if (!ctx) {
    console.warn("Render Canceled; no context")
    return
  }

  const centerX = gridManager.width / 2 - gridManager.gridSize / 2;
  const centerY = gridManager.height / 2 - gridManager.gridSize / 2;

  // Include a margin so cells entering the viewport are drawn before they become visible.
  const minGridX = Math.floor((gridManager.canvasPosition.x - gridManager.width / 2 - gridManager.gridSize / 2) / gridManager.gridSize) - 1;
  const maxGridX = Math.ceil((gridManager.canvasPosition.x + gridManager.width / 2 + gridManager.gridSize / 2) / gridManager.gridSize) + 1;
  const minGridY = Math.floor((gridManager.canvasPosition.y - gridManager.height / 2 - gridManager.gridSize / 2) / gridManager.gridSize) - 1;
  const maxGridY = Math.ceil((gridManager.canvasPosition.y + gridManager.height / 2 + gridManager.gridSize / 2) / gridManager.gridSize) + 1;

  const cursorGridPos = gridManager.getCusorGridPosition()


  for (let gridX = minGridX; gridX <= maxGridX; gridX += 1) {
    for (let gridY = minGridY; gridY <= maxGridY; gridY += 1) {
      // Grid cells are centered on the canvas origin; floor to keep edges pixel-aligned.
      const x = Math.floor(centerX + gridX * gridManager.gridSize - gridManager.canvasPosition.x);
      const y = Math.floor(centerY - gridY * gridManager.gridSize + gridManager.canvasPosition.y);

      ctx.fillStyle = 'gray';
      ctx.fillRect(x, y, gridManager.gridSize, gridManager.gridSize);
      ctx.fillStyle = 'white'
      ctx.fillRect(
        x + borderWidth / 2,
        y + borderWidth / 2,
        gridManager.gridSize - borderWidth,
        gridManager.gridSize - borderWidth
      );


      if (cursorGridPos.x == gridX && cursorGridPos.y == gridY) {
        ctx.fillStyle = "#DFDFDF"
        ctx.fillRect(
          x + borderWidth / 2,
          y + borderWidth / 2,
          gridManager.gridSize - borderWidth,
          gridManager.gridSize - borderWidth
        );
      }

      const item = gridManager.getItemAtPosition(gridX, gridY)
      item?.render({ x, y, gridManager });
    }
  }
};
