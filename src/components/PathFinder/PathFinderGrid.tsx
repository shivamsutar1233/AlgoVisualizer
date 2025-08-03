import { FC } from 'react';
import { Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';

export type NodeType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path';

interface Node {
  row: number;
  col: number;
  type: NodeType;
  isVisited: boolean;
  distance: number;
  previousNode: Node | null;
}

interface PathFinderGridProps {
  grid: Node[][];
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

export const PathFinderGrid: FC<PathFinderGridProps> = ({
  grid,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const getNodeColor = (node: Node): string => {
    switch (node.type) {
      case 'wall':
        return '#34495e';
      case 'start':
        return '#2ecc71';
      case 'end':
        return '#e74c3c';
      case 'visited':
        return '#3498db';
      case 'path':
        return '#f1c40f';
      default:
        return '#fff';
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        backgroundColor: 'background.paper',
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${grid[0].length}, 25px)`,
          gap: '1px',
          backgroundColor: '#bdc3c7',
          padding: '1px',
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((node, colIdx) => (
            <motion.div
              key={`${rowIdx}-${colIdx}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: (rowIdx + colIdx) * 0.01 }}
              onMouseDown={() => onMouseDown(rowIdx, colIdx)}
              onMouseEnter={() => onMouseEnter(rowIdx, colIdx)}
              onMouseUp={onMouseUp}
              style={{
                width: '25px',
                height: '25px',
                backgroundColor: getNodeColor(node),
                cursor: 'pointer',
                borderRadius: '2px',
              }}
            />
          ))
        )}
      </Box>
    </Paper>
  );
};
