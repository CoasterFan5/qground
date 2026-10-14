import type { QuantumGridManager } from "./qGridManager";
import { Qubit } from "./qubit";
import type { QuantumGateName } from "./types";

export const gateControls: Record<QuantumGateName, (args: { qubitNumber: number, qubit: Qubit, qGridManager: QuantumGridManager }) => void> = {
  "Hadamard": ({ qubit }) => {
    const a = qubit.aAmplitude;
    const b = qubit.bAmplitude;
    qubit.aAmplitude = (a + b) / Math.SQRT2;
    qubit.bAmplitude = (a - b) / Math.SQRT2;
  },
  "Pauli-X": ({ qubit }) => {
    const oldAmp = qubit.aAmplitude;
    qubit.aAmplitude = qubit.bAmplitude;
    qubit.bAmplitude = oldAmp
  },
  "Measure": ({ qubitNumber, qubit, qGridManager }) => {
    qGridManager.addMeasurement(qubitNumber, qubit.measure())
  }
}
