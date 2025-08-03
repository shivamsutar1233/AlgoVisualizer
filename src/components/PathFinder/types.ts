export type NodeType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path';

export interface GridNode {
  row: number;
  col: number;
  type: NodeType;
  distance: number;
  isVisited: boolean;
  previousNode: GridNode | null;
}

export type Grid = GridNode[][];
