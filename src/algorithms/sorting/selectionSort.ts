import type { SortingGenerator } from "./bubbleSort";

export const selectionSort = function* (array: number[]): SortingGenerator {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // Yield initial state for current iteration
    yield {
      array: [...arr],
      currentIndex: i,
      compareIndex: minIndex,
    };

    // Find the minimum element in the unsorted part of the array
    for (let j = i + 1; j < n; j++) {
      // Show the current comparison
      yield {
        array: [...arr],
        currentIndex: minIndex,
        compareIndex: j,
      };

      if (arr[j] < arr[minIndex]) {
        // Show the new minimum being found
        yield {
          array: [...arr],
          currentIndex: j,
          compareIndex: minIndex,
        };
        minIndex = j;
      }
    }

    // Swap the found minimum element with the first element of the unsorted part
    if (minIndex !== i) {
      // Show the elements being swapped
      yield {
        array: [...arr],
        currentIndex: i,
        compareIndex: minIndex,
      };

      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

      // Show the result after swapping
      yield {
        array: [...arr],
        currentIndex: i,
        compareIndex: -1,
      };
    }
  }

  // Show final state
  return {
    array: arr,
    currentIndex: -1,
    compareIndex: -1,
  };
};
