import type { GridNode as Node } from "../../components/PathFinder/types";

interface Position {
  row: number;
  col: number;
}

const getManhattanDistance = (pos1: Position, pos2: Position): number => {
  return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
};

const getNeighbors = (node: Node, grid: Node[][]): Node[] => {
  const neighbors: Node[] = [];
  const { row, col } = node;
  const directions = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
  ];

  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;

    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length &&
      grid[newRow][newCol].type !== "wall"
    ) {
      neighbors.push(grid[newRow][newCol]);
    }
  }

  return neighbors;
};

export function* astar(
  grid: Node[][]
): Generator<{
  grid: Node[][];
  visitedNodes: Node[];
  currentNode: Node | null;
}> {
  const startNode = grid.flat().find((node) => node.type === "start");
  const endNode = grid.flat().find((node) => node.type === "end");

  if (!startNode || !endNode) {
    throw new Error("Start or end node not found");
  }

  // Reset node properties
  for (const row of grid) {
    for (const node of row) {
      node.isVisited = false;
      node.distance = Infinity;
      node.fScore = Infinity;
      node.gScore = Infinity;
      node.previousNode = null;
    }
  }

  const visitedNodesInOrder: Node[] = [];
  const openSet = new Set<Node>([startNode]);
  startNode.gScore = 0;
  startNode.fScore = getManhattanDistance(startNode, endNode);

  while (openSet.size > 0) {
    // Get node with lowest fScore
    const current = Array.from(openSet).reduce((min, node) =>
      node.fScore < min.fScore ? node : min
    );

    if (current === endNode) {
      // Found the goal
      yield {
        grid: grid.map((row) => [...row]),
        visitedNodes: [...visitedNodesInOrder],
        currentNode: current,
      };
      break;
    }

    openSet.delete(current);
    current.isVisited = true;
    if (current.type !== "start") {
      current.type = "visited";
    }
    visitedNodesInOrder.push(current);

    yield {
      grid: grid.map((row) => [...row]),
      visitedNodes: [...visitedNodesInOrder],
      currentNode: current,
    };

    for (const neighbor of getNeighbors(current, grid)) {
      const tentativeGScore = current.gScore + 1;

      if (tentativeGScore < neighbor.gScore) {
        neighbor.previousNode = current;
        neighbor.gScore = tentativeGScore;
        neighbor.fScore =
          tentativeGScore + getManhattanDistance(neighbor, endNode);

        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
          yield {
            grid: grid.map((row) => [...row]),
            visitedNodes: [...visitedNodesInOrder],
            currentNode: neighbor,
          };
        }
      }
    }
  }

  // Reconstruct and highlight path
  const path: Node[] = [];
  let current: Node | null = endNode;

  while (current && current.previousNode) {
    path.unshift(current);
    current = current.previousNode;
  }

  for (const node of path) {
    if (node.type !== "start" && node.type !== "end") {
      node.type = "path";
      yield {
        grid: grid.map((row) => [...row]),
        visitedNodes: visitedNodesInOrder,
        currentNode: node,
      };
    }
  }

  return {
    grid: grid.map((row) => [...row]),
    visitedNodes: visitedNodesInOrder,
    currentNode: null,
  };
}
