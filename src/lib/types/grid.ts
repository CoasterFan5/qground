import type { GridItem } from "#lib/gridItems/types.js";

type GridXPosition = number;
type GridYPosition = number;
export type GridData = Record<GridXPosition, Record<GridYPosition, GridItem>>
