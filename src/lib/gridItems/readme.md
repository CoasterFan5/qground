# Grid items and signal updates

## How propagation works

`GridManager` starts an update from a changed item and follows cells with borders, so not corner cells. It calls each reached item's `parseUpdates()` method. If that method returns `true`, the manager schedules that item's cardinal neighbors, so on and so on. This means on a click, the entire grid is not simulated, just until a gate that does not change. For instance, from a bit to an and gate that will not change.

Whenever a source changes, the manager resets derived signals in its connected component, then rebuilds from all remaining active sources. This handles both on and off transitions and prevents wire branches from staying powered by stale neighboring wire state.

## Constructing and placing items

Create an item without supplying an ID or coordinates, for example `new AndGate()`. The grid location is assigned by `GridManager` when it registers the item: the built-in grid is initialized from its coordinate-keyed map, and later placements should use `setItemAtPosition(x, y, item)`. That method updates the item's own `x`/`y` fields, which directional signal and serialization code use.

`id` is optional and is not needed for current grid behavior. It is reserved for future serialization/deserialization; do not use it as the source of an item's grid location.

## `GridItem` signal contract

When adding a signal-producing item, implement these methods consistently:

- `getSignal()` returns the item's current output signal. Gates should return their output, not an input value. This means that most of the time it will just return `item.isOn`. 
- `parseUpdates({ gridX, gridY, gridManager })` reads the item's inputs, calculates the next output, stores it, and returns `true` only when the output changed. Missing or unpowered inputs should be treated as `false` unless the gate's logic says otherwise. This is where `inOn` should be toggled for most gates.
- `canPowerNeighbor(targetX, targetY)` controls which cardinal neighbor(s) can receive this item's output. The default allows output in every cardinal direction; directional gates should override it. For example, the NOT gate and AND gate output to the right only. Bits output everywhere! 
- `shouldUpdateInitially()` should return `true` for gates that need to calculate their initial output before the first click. It defaults to `false`.
- `isSignalSource()` returns `true` only for independent active sources, such as a powered `ClassicBit`. Derived gates and wires return `false`.
- `resetSignal()` clears derived output and returns `true` if it changed. Independent sources should remain unchanged.
- `onClick()` returns `true` only when a click changes the item's state, so the manager knows to start an update from that item's grid position.

Do not use `instanceof` checks in the scheduler to identify gate types. Keep gate-specific input and output rules in the item itself.

## AND gate wiring

The current AND gate has two inputs on its upper and lower cardinal neighbors, and one output to the right:

- upper input: `(gridX, gridY + 1)`
- lower input: `(gridX, gridY - 1)`
- output: `(gridX + 1, gridY)`

Its output is on only when both inputs' `getSignal()` values are `true`. A missing input counts as off. When implementing a different gate, document its input positions and override `canPowerNeighbor()` if its output direction differs.
