import type { SortingGenerator } from "./bubbleSort";

export const insertionSort = function* (array: number[]): SortingGenerator {
  const arr = [...array];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    yield {
      array: [...arr],
      currentIndex: i,
      compareIndex: j
    };

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;

      yield {
        array: [...arr],
        currentIndex: j + 1,
        compareIndex: j
      };
    }

    arr[j + 1] = key;
    yield {
      array: [...arr],
      currentIndex: j + 1,
      compareIndex: i
    };
  }

  return {
    array: arr,
    currentIndex: -1,
    compareIndex: -1
  };
};
