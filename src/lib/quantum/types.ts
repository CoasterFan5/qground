export const quantumGateList = ['Pauli-X', "Hadamard", "Measure"] as const
export type QuantumGateName = typeof quantumGateList[number]
export type Measurement = 0 | 1
export type SimResult = Record<number, {
  0: number,
  1: number
}>
export type QuantumGridCell =
  {
    gate: QuantumGateName;
  }


export type QuantumGridData = Record<
  number,
  Record<
    number,
    QuantumGridCell
    | undefined
  >
>
