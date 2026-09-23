export const renderGrid = ({ ctx, offsetX, offsetY, width, height, gridSize }: { ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, width: number, height: number, gridSize: number }) => {
  ctx.strokeStyle = 'gray';
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let x = offsetX % gridSize; x < width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = offsetY % gridSize; y < height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);

  }
  ctx.moveTo(0, 0)
  ctx.stroke()
};
