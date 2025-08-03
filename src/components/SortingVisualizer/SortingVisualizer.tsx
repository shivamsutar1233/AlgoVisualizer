import { useState, useRef } from "react";
import { Box } from "@mui/material";
import { ControlPanel } from "../ControlPanel/ControlPanel";
import { VisualizerCanvas } from "../VisualizerCanvas/VisualizerCanvas";
import { bubbleSort } from "../../algorithms/sorting/bubbleSort";
import { quickSort } from "../../algorithms/sorting/quickSort";
import { mergeSort } from "../../algorithms/sorting/mergeSort";
import { selectionSort } from "../../algorithms/sorting/selectionSort";
import { insertionSort } from "../../algorithms/sorting/insertionSort";
import { heapSort } from "../../algorithms/sorting/heapSort";
import type { SortingGenerator } from "../../algorithms/sorting/bubbleSort";
import type { SortingAlgorithm } from "../ControlPanel/ControlPanel";

export const SortingVisualizer = () => {
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>("bubbleSort");
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
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          p: { xs: 2, sm: 3 },
          mx: 0,
          borderRadius: 0,
          boxShadow: (theme) => theme.shadows[4],
          backdropFilter: "blur(8px)",
          border: 0,
          borderBottom: 1,
          borderColor: "divider",
          width: "100%",
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
          height: { xs: "65vh", sm: "75vh", md: "80vh" },
          minHeight: "500px",
          bgcolor: "background.paper",
          borderRadius: 0,
          boxShadow: (theme) => theme.shadows[4],
          overflow: "hidden",
          border: 0,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          backdropFilter: "blur(8px)",
        }}
      >
        <VisualizerCanvas
          data={array}
          currentIndex={currentIndex}
          compareIndex={compareIndex}
        />
      </Box>
    </Box>
  );
};
