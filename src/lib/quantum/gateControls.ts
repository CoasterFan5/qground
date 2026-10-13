import type { QuantumGridManager } from "./qGridManager";
import { Qubit } from "./qubit";
import type { QuantumGateName } from "./types";

export const gateControls: Record<QuantumGateName, (args: { qubitNumber: number, qubit: Qubit, qGridManager: QuantumGridManager }) => void> = {
  "Hadamard": ({ qubit }) => { qubit.setBalancedSuperPosition() },
  "Pauli-X": ({ qubit }) => { const oldAmp = qubit.aAmplitude; qubit.aAmplitude = qubit.bAmplitude; qubit.bAmplitude = oldAmp },
  "Measure": ({ qubitNumber, qubit, qGridManager }) => {
    qGridManager.addMeasurement(qubitNumber, qubit.measure())
  }
}
