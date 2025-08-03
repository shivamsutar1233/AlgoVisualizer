import React, { useState, useRef } from "react";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { ControlPanel } from "./components/ControlPanel/ControlPanel";
import { VisualizerCanvas } from "./components/VisualizerCanvas/VisualizerCanvas";
import { InfoPanel } from "./components/InfoPanel/InfoPanel";
import { PathFinder } from "./components/PathFinder/PathFinder";
import { bubbleSort } from "./algorithms/sorting/bubbleSort";
import { quickSort } from "./algorithms/sorting/quickSort";
import { mergeSort } from "./algorithms/sorting/mergeSort";
import { selectionSort } from "./algorithms/sorting/selectionSort";
import { insertionSort } from "./algorithms/sorting/insertionSort";
import { heapSort } from "./algorithms/sorting/heapSort";
import type { SortingGenerator } from "./algorithms/sorting/bubbleSort";
import type { Algorithm } from "./components/ControlPanel/ControlPanel";

type VisualizerType = "sorting" | "pathfinding";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [visualizerType, setVisualizerType] = useState<VisualizerType>("sorting");
  const [algorithm, setAlgorithm] = useState<Algorithm>("bubbleSort");
  const [speed, setSpeed] = useState(2.5);
  const [array, setArray] = useState<number[]>(() => {
    const size = 30;
    return Array.from({ length: size }, () =>
      Math.floor(Math.random() * (100 - 10) + 10)
    ).sort(() => Math.random() - 0.5);
  });
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [compareIndex, setCompareIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const runningRef = useRef(false);
  const sortingGeneratorRef = useRef<SortingGenerator | null>(null);

  const resetArray = () => {
    if (runningRef.current) return;
    const size = 30;
    const newArray = Array.from({ length: size }, () =>
      Math.floor(Math.random() * (100 - 10) + 10)
    ).sort(() => Math.random() - 0.5);
    setArray(newArray);
    setCurrentIndex(-1);
    setCompareIndex(-1);
    sortingGeneratorRef.current = null;
  };

  const pauseSorting = () => {
    runningRef.current = false;
    setIsRunning(false);
  };

  const startSorting = async () => {
    if (runningRef.current) return;

    runningRef.current = true;
    setIsRunning(true);

    if (!sortingGeneratorRef.current) {
      switch (algorithm) {
        case "quickSort":
          sortingGeneratorRef.current = quickSort(array);
          break;
        case "mergeSort":
          sortingGeneratorRef.current = mergeSort(array);
          break;
        case "heapSort":
          sortingGeneratorRef.current = heapSort(array);
          break;
        case "insertionSort":
          sortingGeneratorRef.current = insertionSort(array);
          break;
        case "selectionSort":
          sortingGeneratorRef.current = selectionSort(array);
          break;
        case "bubbleSort":
        default:
          sortingGeneratorRef.current = bubbleSort(array);
          break;
      }
    }

    try {
      while (runningRef.current) {
        const result = sortingGeneratorRef.current.next();
        if (result.done) {
          sortingGeneratorRef.current = null;
          break;
        }

        const {
          array: newArray,
          currentIndex: newCurrentIndex,
          compareIndex: newCompareIndex,
        } = result.value;
        setArray(newArray);
        setCurrentIndex(newCurrentIndex);
        setCompareIndex(newCompareIndex);

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
      if (sortingGeneratorRef.current?.next().done) {
        sortingGeneratorRef.current = null;
        setCurrentIndex(-1);
        setCompareIndex(-1);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          maxWidth: "100%",
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          m: 0,
          p: 0,
        }}
      >
        <Box
          component="main"
          sx={{
            width: "100%",
            px: 0,
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            align="center"
            sx={{
              color: "text.primary",
              fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
              fontWeight: "bold",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              mb: { xs: 1, sm: 2 },
              pt: { xs: 1, sm: 2 },
            }}
          >
            Algorithm Visualizer
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: theme.shadows[2],
                overflow: "hidden",
              }}
            >
              <ToggleButtonGroup
                value={visualizerType}
                exclusive
                onChange={(_, newType) => {
                  if (newType !== null) {
                    setVisualizerType(newType as VisualizerType);
                    if (runningRef.current) {
                      runningRef.current = false;
                      setIsRunning(false);
                    }
                    if (newType === "sorting") {
                      resetArray();
                    }
                  }
                }}
                aria-label="visualizer type"
              >
                <ToggleButton value="sorting" aria-label="sorting algorithms">
                  Sorting
                </ToggleButton>
                <ToggleButton value="pathfinding" aria-label="pathfinding algorithms">
                  Pathfinding
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {visualizerType === "sorting" ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  bgcolor: "background.paper",
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                }}
              >
                <ControlPanel
                  algorithm={algorithm}
                  setAlgorithm={setAlgorithm}
                  speed={speed}
                  setSpeed={setSpeed}
                  onStart={startSorting}
                  onPause={pauseSorting}
                  onReset={resetArray}
                  isRunning={isRunning}
                />
              </Box>

              <Box
                sx={{
                  height: { xs: "65vh", sm: "75vh" },
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <VisualizerCanvas
                  data={array}
                  currentIndex={currentIndex}
                  compareIndex={compareIndex}
                />
              </Box>

              <Box
                sx={{
                  bgcolor: "background.paper",
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                }}
              >
                <InfoPanel
                  algorithm={algorithm}
                  currentStep={currentIndex}
                  totalSteps={array.length}
                  timeComplexity={
                    algorithm === "bubbleSort"
                      ? "O(n²)"
                      : algorithm === "quickSort"
                      ? "O(n log n)"
                      : "O(n log n)"
                  }
                  spaceComplexity={
                    algorithm === "bubbleSort"
                      ? "O(1)"
                      : algorithm === "quickSort"
                      ? "O(log n)"
                      : "O(n)"
                  }
                />
              </Box>
            </Box>
          ) : (
            <PathFinder />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
