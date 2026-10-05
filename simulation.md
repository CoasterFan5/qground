# Classical simulation plan

## Connections

- Grid faces are north (`y + 1`), east (`x + 1`), south (`y - 1`), and west (`x - 1`). Gates declare input and output ports on specific faces. For example, an AND gate takes inputs from north and south and outputs east; a NOT gate takes input from west and outputs east.
- A gate only connects through its declared ports. Adjacent gates connect directly only when an output faces a compatible input.
- Wires are passive. Plain wires connect to adjacent wires on all four faces; branches are allowed. Wires carry a signal from a connected output to any connected gate inputs, but do not create or change the signal.

## Build and validate

When the layout changes, build the connected wire networks by following adjacent wire faces. Attach gate ports to the network beside that face. Treat each connected wire group as one network; wire-only loops are allowed.

A network may have no driver (it reads `false`) or one driver. More than one driver is invalid. Networks with no connected inputs are allowed. Gate inputs with no driver are also allowed and read as `false`.

Build a directed graph from each source or gate output to the gates it feeds. Reject cycles in this graph; do not mistake a loop of wire cells for feedback. Fan-out and branches are valid.

## Simulate

Evaluate the graph in topological order. Sources are level 0; each gate is one level after its latest input driver. Evaluate unconnected inputs as `false`.

The simulator returns signal values for the renderer to display; gates and wires do not propagate or store simulation state themselves. Changing a source runs the simulator again. Changing the layout rebuilds and validates the circuit.

Quantum circuits will use their own connection and simulation rules; classical wire fan-out does not apply to qubits.
