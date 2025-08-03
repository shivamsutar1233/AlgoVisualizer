import type { SortingGenerator } from "./bubbleSort";

function* heapify(arr: number[], n: number, i: number): Generator<{ array: number[], currentIndex: number, compareIndex: number }> {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n) {
    yield {
      array: [...arr],
      currentIndex: largest,
      compareIndex: left
    };

    if (arr[left] > arr[largest]) {
      largest = left;
    }
  }

  if (right < n) {
    yield {
      array: [...arr],
      currentIndex: largest,
      compareIndex: right
    };

    if (arr[right] > arr[largest]) {
      largest = right;
    }
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    yield {
      array: [...arr],
      currentIndex: i,
      compareIndex: largest
    };

    yield* heapify(arr, n, largest);
  }
}

export const heapSort = function* (array: number[]): SortingGenerator {
  const arr = [...array];
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    yield {
      array: [...arr],
      currentIndex: 0,
      compareIndex: i
    };

    yield* heapify(arr, i, 0);
  }

  return {
    array: arr,
    currentIndex: -1,
    compareIndex: -1
  };
};
