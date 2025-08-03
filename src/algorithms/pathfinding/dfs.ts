import type { GridNode as Node } from "../../components/PathFinder/types";

const getUnvisitedNeighbors = (node: Node, grid: Node[][]): Node[] => {
  const neighbors: Node[] = [];
  const { row, col } = node;
  const directions = [
    [-1, 0], // up
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
  ];

  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;

    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length &&
      !grid[newRow][newCol].isVisited &&
      grid[newRow][newCol].type !== "wall"
    ) {
      neighbors.push(grid[newRow][newCol]);
    }
  }

  return neighbors;
};

export function* dfs(
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
      node.previousNode = null;
    }
  }

  const visitedNodesInOrder: Node[] = [];
  const stack: Node[] = [startNode];
  let foundEnd = false;

  while (stack.length > 0 && !foundEnd) {
    const currentNode = stack.pop()!;

    if (!currentNode.isVisited) {
      currentNode.isVisited = true;
      if (currentNode.type !== "start") {
        currentNode.type = "visited";
      }
      visitedNodesInOrder.push(currentNode);

      yield {
        grid: grid.map((row) => [...row]),
        visitedNodes: [...visitedNodesInOrder],
        currentNode: currentNode,
      };

      if (currentNode === endNode) {
        foundEnd = true;
        break;
      }

      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        neighbor.previousNode = currentNode;
        stack.push(neighbor);
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
