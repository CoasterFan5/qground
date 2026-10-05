import type { GridManager } from '../routes/play/classic/gridManager';
import type { GridItem, PositionType } from './gridItems/types';

/**
 * I did not write this
 * But it runs so who am I to judge
 */

const faces = {
  north: { x: 0, y: 1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: -1 },
  west: { x: -1, y: 0 }
} as const;
type Face = keyof typeof faces;

const opposite: Record<Face, Face> = {
  north: 'south',
  east: 'west',
  south: 'north',
  west: 'east'
};

const positionKey = (x: number, y: number) => `${x},${y}`;
const adjacent = (position: PositionType, face: Face): PositionType => ({
  x: position.x + faces[face].x,
  y: position.y + faces[face].y
});

type SimItem = GridItem & {
  inputFaces?: readonly Face[];
  outputFaces?: readonly Face[];
  isOn?: boolean;
};
type WireNetworks = {
  networkByCell: Map<string, string>;
  cellsByNetwork: Map<string, string[]>;
};

/** Builds wire nets, validates the directed gate graph, then evaluates gates in order. */
export class SimulationManager {
  private readonly gridManager: GridManager;
  private readonly values = new Map<string, boolean>();

  constructor(gridManager: GridManager) {
    this.gridManager = gridManager;
    this.simulate();
  }

  simulate(): ReadonlyMap<string, boolean> {
    const start = Date.now()
    const items = this.getItems();
    const wires = items.filter((item) => item.isSignalConduit());
    const sources = items.filter((item) => this.isSource(item));
    const gates = items.filter((item) => this.isGate(item));
    this.resetDerivedSignals(wires, gates);
    const networks = this.buildWireNetworks(wires);
    const sourceIds = new Set(sources.map((item) => positionKey(item.x, item.y)));
    const gateIds = new Set(gates.map((item) => positionKey(item.x, item.y)));
    const outputItems = [...sources, ...gates];
    const networkDrivers = this.findNetworkDrivers(networks, outputItems);
    const gateInputs = new Map<string, Map<Face, string | undefined>>();

    for (const gate of gates) {
      const inputs = new Map<Face, string | undefined>();
      for (const face of this.inputFaces(gate)) {
        const neighbor = adjacent(gate, face);
        const adjacentItem = this.gridManager.getItemAtPosition(neighbor.x, neighbor.y);
        if (adjacentItem?.isSignalConduit()) {
          const networkId = networks.networkByCell.get(positionKey(neighbor.x, neighbor.y));
          inputs.set(face, networkId ? networkDrivers.get(networkId) : undefined);
        } else {
          const driver = adjacentItem as SimItem | undefined;
          const id =
            driver && this.outputFaces(driver).includes(opposite[face])
              ? positionKey(driver.x, driver.y)
              : undefined;
          inputs.set(face, id && (sourceIds.has(id) || gateIds.has(id)) ? id : undefined);
        }
      }
      gateInputs.set(positionKey(gate.x, gate.y), inputs);
    }

    const gateOrder = this.sortGates(gates, gateInputs, gateIds);
    for (const source of sources) {
      this.values.set(positionKey(source.x, source.y), source.getSignal());
    }

    for (const gate of gateOrder) {
      const gateId = positionKey(gate.x, gate.y);
      const signalByInputPosition = new Map<string, boolean>();
      for (const [face, driverId] of gateInputs.get(gateId) ?? []) {
        const inputPosition = adjacent(gate, face);
        const signal = driverId ? (this.values.get(driverId) ?? false) : false;
        signalByInputPosition.set(positionKey(inputPosition.x, inputPosition.y), signal);
      }
      const simulationGrid = {
        getItemAtPosition: (x: number, y: number) => {
          const key = positionKey(x, y);
          if (!signalByInputPosition.has(key)) return undefined;
          const signal = signalByInputPosition.get(key) ?? false;
          return { getSignal: () => signal } as GridItem;
        }
      } as GridManager;

      gate.parseUpdates({ gridX: gate.x, gridY: gate.y, gridManager: simulationGrid });
      this.values.set(positionKey(gate.x, gate.y), gate.getSignal());
    }

    for (const [networkId, cells] of networks.cellsByNetwork) {
      const driverId = networkDrivers.get(networkId);
      const signal = driverId ? (this.values.get(driverId) ?? false) : false;
      for (const cell of cells) {
        const [x, y] = cell.split(',').map(Number);
        const wire = this.gridManager.getItemAtPosition(x, y) as SimItem | undefined;
        if (wire) wire.isOn = signal;
        this.values.set(cell, signal);
      }
    }

    const end = Date.now()
    console.info(`Sim complete in ${end - start}ms`)

    return new Map(this.values);
  }

  private getItems() {
    const items: SimItem[] = [];
    for (const [x, column] of Object.entries(this.gridManager.items)) {
      for (const [y, item] of Object.entries(column)) {
        item.setGridPosition(Number(x), Number(y));
        items.push(item as SimItem);
      }
    }
    return items;
  }

  private itemType(item: GridItem) {
    const json = item.toJSON() as { type?: string };
    return json.type;
  }

  private isSource(item: SimItem) {
    return (
      !item.isSignalConduit() && (item.isSignalSource() || this.itemType(item) === 'classicBit')
    );
  }

  private isGate(item: SimItem) {
    return (
      !item.isSignalConduit() &&
      !this.isSource(item) &&
      typeof item.parseUpdates === 'function' &&
      this.inputFaces(item).length > 0 &&
      this.outputFaces(item).length > 0
    );
  }

  private inputFaces(item: SimItem): Face[] {
    if (item.inputFaces) return [...item.inputFaces];
    return this.itemType(item) === 'notGate' ? ['west'] : [];
  }

  private outputFaces(item: SimItem): Face[] {
    if (item.outputFaces) return [...item.outputFaces];
    switch (this.itemType(item)) {
      case 'classicBit':
        return ['north', 'east', 'south', 'west'];
      case 'notGate':
        return ['east'];
      default:
        return [];
    }
  }

  private buildWireNetworks(wires: SimItem[]): WireNetworks {
    const networkByCell = new Map<string, string>();
    const cellsByNetwork = new Map<string, string[]>();

    for (const wire of wires) {
      const start = positionKey(wire.x, wire.y);
      if (networkByCell.has(start)) continue;

      const networkId = `network:${start}`;
      const pending = [{ x: wire.x, y: wire.y }];
      const cells: string[] = [];
      networkByCell.set(start, networkId);
      while (pending.length > 0) {
        const current = pending.pop()!;
        const currentKey = positionKey(current.x, current.y);
        cells.push(currentKey);
        for (const face of Object.keys(faces) as Face[]) {
          const neighbor = adjacent(current, face);
          const neighborItem = this.gridManager.getItemAtPosition(neighbor.x, neighbor.y);
          const neighborKey = positionKey(neighbor.x, neighbor.y);
          if (neighborItem?.isSignalConduit() && !networkByCell.has(neighborKey)) {
            networkByCell.set(neighborKey, networkId);
            pending.push(neighbor);
          }
        }
      }
      cellsByNetwork.set(networkId, cells);
    }

    return { networkByCell, cellsByNetwork };
  }

  private findNetworkDrivers(networks: WireNetworks, outputItems: SimItem[]) {
    const outputByPosition = new Map(
      outputItems.map((item) => [positionKey(item.x, item.y), item])
    );
    const drivers = new Map<string, Set<string>>();

    for (const [networkId, cells] of networks.cellsByNetwork) {
      const networkDrivers = new Set<string>();
      for (const cell of cells) {
        const [x, y] = cell.split(',').map(Number);
        const position = { x, y };
        for (const face of Object.keys(faces) as Face[]) {
          const neighbor = adjacent(position, face);
          const output = outputByPosition.get(positionKey(neighbor.x, neighbor.y));
          if (output && this.outputFaces(output).includes(opposite[face])) {
            networkDrivers.add(positionKey(output.x, output.y));
          }
        }
      }
      if (networkDrivers.size > 1) {
        throw new Error(`Wire network has multiple drivers: ${[...networkDrivers].join(', ')}`);
      }
      drivers.set(networkId, networkDrivers);
    }

    return new Map(
      [...drivers].flatMap(([networkId, networkDrivers]) => {
        const driver = networkDrivers.values().next().value as string | undefined;
        return driver ? [[networkId, driver] as const] : [];
      })
    );
  }

  private sortGates(
    gates: SimItem[],
    gateInputs: Map<string, Map<Face, string | undefined>>,
    gateIds: Set<string>
  ) {
    const remainingDependencies = new Map<string, Set<string>>();
    const dependents = new Map<string, Set<string>>();
    const gateById = new Map(gates.map((gate) => [positionKey(gate.x, gate.y), gate]));

    for (const gate of gates) {
      const gateId = positionKey(gate.x, gate.y);
      const dependencies = new Set<string>();
      for (const driver of gateInputs.get(gateId)?.values() ?? []) {
        if (driver && gateIds.has(driver)) dependencies.add(driver);
      }
      remainingDependencies.set(gateId, dependencies);
      for (const driver of dependencies) {
        const destinations = dependents.get(driver) ?? new Set<string>();
        destinations.add(gateId);
        dependents.set(driver, destinations);
      }
    }

    const queue = [...remainingDependencies]
      .filter(([, dependencies]) => dependencies.size === 0)
      .map(([id]) => id);
    const order: SimItem[] = [];
    for (let index = 0; index < queue.length; index += 1) {
      const gateId = queue[index];
      const gate = gateById.get(gateId);
      if (gate) order.push(gate);
      for (const destination of dependents.get(gateId) ?? []) {
        const dependencies = remainingDependencies.get(destination)!;
        dependencies.delete(gateId);
        if (dependencies.size === 0) queue.push(destination);
      }
    }

    if (order.length !== gates.length) {
      throw new Error('Circuit contains a gate feedback cycle.');
    }
    return order;
  }

  private resetDerivedSignals(wires: SimItem[], gates: SimItem[]) {
    this.values.clear();
    for (const item of [...wires, ...gates]) item.resetSignal();
  }
}
