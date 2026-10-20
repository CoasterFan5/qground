import { gateControls } from "./gateControls";
import { Qubit } from "./qubit";
import type { Measurement, QuantumGridCell, QuantumGridData, SimResult } from "./types";


export class QuantumGridManager {
  qubits = 0;
  columns = 0;

  private data: QuantumGridData = {}
  private subscribers = new Set<() => void>()
  private measurements: SimResult = {}

  constructor(qubits: number, columns: number) {
    this.qubits = qubits;
    this.columns = columns
    this.data = {}
    this.createGrid()
  }

  private createGrid() {
    const newData: QuantumGridData = {}
    for (let i = 0; i < this.qubits; i++) {
      newData[i] = {}
      for (let j = 0; j < this.columns; j++) {
        if (this.data[i] && this.data[i][j]) {
          newData[i][j] = this.data[i][j]
        } else {
          newData[i][j] = undefined
        }
      }
    }
    this.data = newData
    this.callSubscribers()
  }

  addQubit() {
    this.qubits += 1;
    this.createGrid()
  }

  addColumn() {
    this.columns += 1;
    this.createGrid()
  }

  callSubscribers() {
    const s = this.subscribers.values()
    for (const a of s) {
      a()
    }
  }

  subscribeToChanges(callback: () => void) {
    this.subscribers.add(callback)
  }

  getRows(): Record<number, QuantumGridCell | undefined>[] {
    const a = Object.entries(this.data)
    const rows = a.map((item) => item[1])
    return rows;
  }

  setGate(qubit: number, column: number, gate: QuantumGridCell | undefined): boolean {
    if (qubit < this.qubits && column < this.columns && qubit > 0 && column > 0) {
      this.data[qubit][column] = gate
      return true
    }
    return false;
  }

  addMeasurement(qubit: number, measurement: Measurement) {
    if (!this.measurements[qubit]) {
      this.measurements[qubit] = {
        0: 0,
        1: 0
      }
    }
    const previousState = this.measurements[qubit]
    if (measurement === 1) {
      previousState[1] += 1;
    } else {
      previousState[0] += 1;
    }
  }

  runSimulation(shots: number): SimResult {
    this.measurements = []
    const start = Date.now()
    for (let s = 0; s < shots; s++) {
      const qubits: Record<number, Qubit> = {}
      for (let i = 0; i < this.qubits; i++) {
        qubits[i] = new Qubit()
      }
      for (let c = 0; c < this.columns; c++) {
        for (let qb = 0; qb < this.qubits; qb++) {
          const qubit = qubits[qb]
          if (this.data[qb] && this.data[qb][c]) {
            const g = this.data[qb][c]
            if (g) {
              gateControls[g.gate]({ qubit, qubitNumber: qb, qGridManager: this })
            }

          }
        }
      }
    }
    const end = Date.now()
    console.info(`Simulation w/ ${shots} shots run in ${end - start}ms`)
    return this.measurements;
  }
}
