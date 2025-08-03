import type { GridNode as Node } from "../../components/PathFinder/types";

interface PathFindingStep {
  grid: Node[][];
  visitedNodes: Node[];
  currentNode: Node | null;
}

export type PathFindingGenerator = Generator<
  PathFindingStep,
  PathFindingStep,
  undefined
>;

const getAllNodes = (grid: Node[][]): Node[] => {
  const nodes: Node[] = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
};

const getUnvisitedNeighbors = (node: Node, grid: Node[][]): Node[] => {
  const neighbors: Node[] = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(
    (neighbor) => !neighbor.isVisited && neighbor.type !== "wall"
  );
};

const updateUnvisitedNeighbors = (node: Node, grid: Node[][]): void => {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
};

export function* dijkstra(grid: Node[][]): PathFindingGenerator {
  const startNode = grid.flat().find((node) => node.type === "start");
  const endNode = grid.flat().find((node) => node.type === "end");

  if (!startNode || !endNode) {
    throw new Error("Start or end node not found");
  }

  const visitedNodesInOrder: Node[] = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    if (!closestNode) break;
    if (closestNode.distance === Infinity) break;

    closestNode.isVisited = true;
    if (closestNode.type !== "start" && closestNode.type !== "end") {
      closestNode.type = "visited";
    }

    visitedNodesInOrder.push(closestNode);

    yield {
      grid: grid.map((row) => [...row]),
      visitedNodes: [...visitedNodesInOrder],
      currentNode: closestNode,
    };

    if (closestNode === endNode) break;

    updateUnvisitedNeighbors(closestNode, grid);
  }

  // Backtrack to find the shortest path
  const nodesInShortestPath = getNodesInShortestPath(endNode);
  for (const node of nodesInShortestPath) {
    if (node.type !== "start" && node.type !== "end") {
      node.type = "path";
    }
    yield {
      grid: grid.map((row) => [...row]),
      visitedNodes: visitedNodesInOrder,
      currentNode: node,
    };
  }

  return {
    grid: grid.map((row) => [...row]),
    visitedNodes: visitedNodesInOrder,
    currentNode: null,
  };
}

const sortNodesByDistance = (unvisitedNodes: Node[]): void => {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
};

const getNodesInShortestPath = (endNode: Node): Node[] => {
  const nodesInShortestPath: Node[] = [];
  let currentNode: Node | null = endNode;
  while (currentNode !== null) {
    nodesInShortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPath;
};
