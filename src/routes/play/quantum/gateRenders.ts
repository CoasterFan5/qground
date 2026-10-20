import type { QuantumGateName } from "#lib/quantum/types.js";
import type { Component } from "svelte";
import Hadamard from "./Hadamard.svelte";
import Measure from "./Measure.svelte";
import PauliX from "./PauliX.svelte";

export const gateRenders: Record<QuantumGateName, Component> = {
  "Hadamard": Hadamard,
  'Measure': Measure,
  "Pauli-X": PauliX,
}
