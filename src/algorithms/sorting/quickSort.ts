import type { SortingGenerator } from './bubbleSort';

function* quickSortHelper(
  array: number[],
  low: number,
  high: number
): SortingGenerator {
  if (low < high) {
    // Select pivot
    const pivot = array[high];
    let i = low - 1;

    // Partition the array
    for (let j = low; j < high; j++) {
      yield {
        array: [...array],
        currentIndex: j,
        compareIndex: high // comparing with pivot
      };

      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        yield {
          array: [...array],
          currentIndex: i,
          compareIndex: j
        };
      }
    }

    // Place pivot in its final position
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    const pivotIndex = i + 1;

    yield {
      array: [...array],
      currentIndex: pivotIndex,
      compareIndex: high
    };

    // Recursively sort the left part
    yield* quickSortHelper(array, low, pivotIndex - 1);
    // Recursively sort the right part
    yield* quickSortHelper(array, pivotIndex + 1, high);
  }

  return {
    array: [...array],
    currentIndex: -1,
    compareIndex: -1
  };
}

export function* quickSort(array: number[]): SortingGenerator {
  const arr = [...array];
  yield* quickSortHelper(arr, 0, arr.length - 1);
}
