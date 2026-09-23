import type { BaseGridItem, GridItemHandler } from "./types";
export type NotGateItem = BaseGridItem & {
  type: 'notGate'
}


export const notGateHandler: GridItemHandler<NotGateItem> = {
  onClick: () => { },
  renderer: ({ x, y }, { ctx }) => {
    const baseWidth = 40;
    const baseHeight = 40;
    const xOffset = baseWidth / 2;
    const yOffset = baseHeight / 2;
    const trueX = x - xOffset;
    const trueY = y - yOffset;

    // we need to draw a quick triangle


    ctx.fillStyle = "#000000"
    ctx.fillRect(trueX, trueY, baseWidth, baseHeight)
    ctx.fillStyle = "#f1f1f1"
    ctx.fillRect(trueX + 1, trueY + 1, baseWidth - 2, baseHeight - 2)

    ctx.strokeStyle = 'black'
    ctx.moveTo(trueX + 5, trueY + 5)
    ctx.lineTo(trueX + 5, trueY + 35)
    ctx.lineTo(trueX + 20, trueY + 20)
    ctx.lineTo(trueX + 5, trueY + 5)
    ctx.moveTo(trueX + 30, trueY + 20)
    ctx.arc(trueX + 25, trueY + 20, 5, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = ""
  },
}
