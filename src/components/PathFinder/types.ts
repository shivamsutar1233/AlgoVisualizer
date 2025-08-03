export type NodeType = "empty" | "wall" | "start" | "end" | "visited" | "path";

export interface GridNode {
  row: number;
  col: number;
  type: NodeType;
  distance: number;
  isVisited: boolean;
  previousNode: GridNode | null;
  gScore: number;
  fScore: number;
}

export type Grid = GridNode[][];
