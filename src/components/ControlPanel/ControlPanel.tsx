import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Button,
  Typography,
} from "@mui/material";
import { FC } from "react";

export type SortingAlgorithm = "bubbleSort" | "quickSort" | "mergeSort" | "heapSort" | "insertionSort" | "selectionSort";
export type PathFindingAlgorithm = "dijkstra" | "astar" | "bfs" | "dfs";
export type Algorithm = SortingAlgorithm | PathFindingAlgorithm;

interface ControlPanelProps {
  algorithm: Algorithm;
  setAlgorithm: (algorithm: Algorithm) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  onStart: () => void;
  isRunning: boolean;
  onPause: () => void;
  onReset: () => void;
}

const algorithmNames: Record<Algorithm, string> = {
  // Sorting Algorithms
  bubbleSort: "Bubble Sort",
  quickSort: "Quick Sort",
  mergeSort: "Merge Sort",
  heapSort: "Heap Sort",
  insertionSort: "Insertion Sort",
  selectionSort: "Selection Sort",
  // Pathfinding Algorithms
  dijkstra: "Dijkstra's Algorithm",
  astar: "A* Search",
  bfs: "Breadth-First Search",
  dfs: "Depth-First Search",
};

export const ControlPanel: FC<ControlPanelProps> = ({
  algorithm,
  setAlgorithm,
  speed,
  setSpeed,
  onStart,
  onPause,
  onReset,
  isRunning,
}) => {
  return (
    <Box sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Algorithm</InputLabel>
        <Select
          value={algorithm}
          label="Algorithm"
          onChange={(e) => setAlgorithm(e.target.value as SortingAlgorithm)}
          disabled={isRunning}
        >
          {Object.entries(algorithmNames).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ width: 200 }}>
        <Typography
          gutterBottom
          variant="caption"
          sx={{ display: "block", textAlign: "center" }}
        >
          Animation Speed: {speed}x
        </Typography>
        <Slider
          value={speed}
          min={0.5}
          max={5}
          step={0.5}
          onChange={(_, value) => setSpeed(value as number)}
          valueLabelDisplay="auto"
          marks={[
            { value: 0.5, label: "Slow" },
            { value: 2.5, label: "Normal" },
            { value: 5, label: "Fast" },
          ]}
          aria-label="Speed"
        />
      </Box>

      {!isRunning ? (
        <Button variant="contained" color="primary" onClick={onStart}>
          Start
        </Button>
      ) : (
        <Button variant="contained" color="secondary" onClick={onPause}>
          Pause
        </Button>
      )}
      <Button variant="outlined" onClick={onReset} disabled={isRunning}>
        Reset
      </Button>
    </Box>
  );
};
