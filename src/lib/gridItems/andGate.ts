import type { GridManager } from '../../routes/play/classic/gridManager';
import { GridItem, type RenderData } from './types'

export class AndGate extends GridItem {

  isOn: boolean = false;

  onClick() {
    return false;
  }

  render({ x, y, gridManager }: RenderData) {
    const ctx = gridManager.getRenderCtx()
    if (!ctx) {
      return
    }
    ctx.beginPath()
    ctx.lineWidth = 2;
    ctx.fillStyle = '#000000'
    ctx.fillRect(x, y, this.width, this.height)
    ctx.fillStyle = '#f1f1f1'
    ctx.fillRect(x + 1, y + 1, this.width - 2, this.height - 2)
    ctx.strokeStyle = this.isOn ? 'orange' : 'black'
    ctx.moveTo(x + 5, y + 0)
    ctx.lineTo(x + 5, y + 10)
    ctx.lineTo(x + 10, y + 10)
    ctx.lineTo(x + 10, y + 30)
    ctx.lineTo(x + 5, y + 30)
    ctx.lineTo(x + 5, y + 40)
    ctx.moveTo(x + 10, y + 10)
    ctx.lineTo(x + 20, y + 10)
    ctx.arc(x + 20, y + 20, 10, -Math.PI / 2, Math.PI / 2)
    ctx.lineTo(x + 10, y + 30)
    ctx.moveTo(x + 30, y + 20)
    ctx.lineTo(x + 40, y + 20)

    ctx.stroke()
  }

  getSignal() {
    return this.isOn
  }

  canPowerNeighbor(targetX: number, targetY: number) {
    return this.isOn && targetX === this.x + 1 && targetY === this.y
  }

  shouldUpdateInitially() {
    return true
  }

  isSignalSource() {
    return false
  }

  resetSignal() {
    const wasOn = this.isOn
    this.isOn = false
    return wasOn
  }

  parseUpdates({ gridX, gridY, gridManager }: { gridX: number, gridY: number, gridManager: GridManager }): boolean {
    const upperInput = gridManager.getItemAtPosition(gridX, gridY + 1)
    const lowerInput = gridManager.getItemAtPosition(gridX, gridY - 1)
    const nextState = upperInput?.getSignal() === true && lowerInput?.getSignal() === true
    if (nextState === this.isOn) {
      return false
    }
    this.isOn = nextState
    return true
  }

  toJSON() {
    return {
      type: 'notGate',
      id: this.id,
      x: this.x,
      y: this.y
    }
  }
}
