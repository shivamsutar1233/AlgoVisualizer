import type { FC } from 'react';
import { useState, useRef } from 'react';
import { Box, Paper } from '@mui/material';
import { PathFinderGrid } from './PathFinderGrid';
import { ControlPanel } from '../ControlPanel/ControlPanel';
import type { Algorithm } from '../ControlPanel/ControlPanel';
import { dijkstra } from '../../algorithms/pathfinding/dijkstra';
import { bfs } from '../../algorithms/pathfinding/bfs';
import { dfs } from '../../algorithms/pathfinding/dfs';
import { astar } from '../../algorithms/pathfinding/astar';
import type { PathFindingGenerator } from '../../algorithms/pathfinding/dijkstra';
import type { Grid, GridNode } from './types';

export type PathFindingAlgorithm = 'dijkstra' | 'astar' | 'bfs' | 'dfs';

const createInitialGrid = (rows: number, cols: number): Grid => {
  const grid: Grid = [];
  for (let row = 0; row < rows; row++) {
    const currentRow: GridNode[] = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        type: 'empty',
        distance: Infinity,
        isVisited: false,
        previousNode: null,
      });
    }
    grid.push(currentRow);
  }
  return grid;
};

export const PathFinder: FC = () => {
  const [algorithm, setAlgorithm] = useState<PathFindingAlgorithm>('dijkstra');
  const [speed, setSpeed] = useState(2.5);
  const [isRunning, setIsRunning] = useState(false);
  const [grid, setGrid] = useState<Grid>(() => createInitialGrid(20, 40));
  const [startNode, setStartNode] = useState<GridNode | null>(null);
  const [endNode, setEndNode] = useState<GridNode | null>(null);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'wall' | 'start' | 'end'>('wall');
  
  const runningRef = useRef(false);
  const generatorRef = useRef<PathFindingGenerator | null>(null);

  const handleNodeClick = (row: number, col: number) => {
    if (isRunning) return;

    const newGrid = grid.slice();
    const node = newGrid[row][col];

    if (selectedTool === 'start') {
      // Remove previous start node if it exists
      if (startNode) {
        newGrid[startNode.row][startNode.col].type = 'empty';
      }
      node.type = 'start';
      setStartNode(node);
    } else if (selectedTool === 'end') {
      // Remove previous end node if it exists
      if (endNode) {
        newGrid[endNode.row][endNode.col].type = 'empty';
      }
      node.type = 'end';
      setEndNode(node);
    } else {
      node.type = node.type === 'wall' ? 'empty' : 'wall';
    }

    setGrid(newGrid);
  };

  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return;
    setMouseIsPressed(true);
    handleNodeClick(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseIsPressed || isRunning) return;
    handleNodeClick(row, col);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const onStart = async () => {
    if (runningRef.current || !startNode || !endNode) return;

    runningRef.current = true;
    setIsRunning(true);

    if (!generatorRef.current) {
      const gridCopy = grid.map(row => row.map(node => ({...node})));
      switch (algorithm) {
        case 'dijkstra':
          generatorRef.current = dijkstra(gridCopy);
          break;
        case 'bfs':
          generatorRef.current = bfs(gridCopy);
          break;
        case 'dfs':
          generatorRef.current = dfs(gridCopy);
          break;
        case 'astar':
          generatorRef.current = astar(gridCopy);
          break;
        default:
          break;
      }
    }

    try {
      while (runningRef.current && generatorRef.current) {
        const result = generatorRef.current.next();
        if (result.done) {
          generatorRef.current = null;
          break;
        }

        const { grid: newGrid } = result.value;
        setGrid(newGrid);

        // Calculate delay based on speed
        const baseDelay = 800;
        const minDelay = 50;
        const delay = Math.max(
          minDelay,
          Math.round(baseDelay * Math.pow(0.5, speed - 1))
        );

        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            setTimeout(resolve, delay);
          });
        });
      }
    } finally {
      runningRef.current = false;
      setIsRunning(false);
    }
  };

  const onPause = () => {
    runningRef.current = false;
    setIsRunning(false);
  };

  const onReset = () => {
    if (runningRef.current) return;
    setGrid(createInitialGrid(20, 40));
    setStartNode(null);
    setEndNode(null);
    generatorRef.current = null;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 2 }}>
        <ControlPanel
          algorithm={algorithm}
          setAlgorithm={(newAlgo: Algorithm) => {
            if (
              newAlgo === 'dijkstra' ||
              newAlgo === 'astar' ||
              newAlgo === 'bfs' ||
              newAlgo === 'dfs'
            ) {
              setAlgorithm(newAlgo);
            }
          }}
          speed={speed}
          setSpeed={setSpeed}
          onStart={onStart}
          onPause={onPause}
          onReset={onReset}
          isRunning={isRunning}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          {['wall', 'start', 'end'].map((tool) => (
            <Box
              key={tool}
              onClick={() => setSelectedTool(tool as 'wall' | 'start' | 'end')}
              sx={{
                p: 1,
                cursor: 'pointer',
                bgcolor: selectedTool === tool ? 'primary.main' : 'grey.200',
                color: selectedTool === tool ? 'white' : 'text.primary',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: selectedTool === tool ? 'primary.dark' : 'grey.300',
                },
              }}
            >
              {tool.charAt(0).toUpperCase() + tool.slice(1)}
            </Box>
          ))}
        </Box>
      </Paper>

      <Paper
        sx={{
          p: 2,
          height: '75vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PathFinderGrid
          grid={grid}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onMouseUp={handleMouseUp}
        />
      </Paper>
    </Box>
  );
};
