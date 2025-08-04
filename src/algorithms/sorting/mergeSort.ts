import type { SortingGenerator } from "./bubbleSort";

function* merge(
  array: number[],
  start: number,
  middle: number,
  end: number
): SortingGenerator {
  const leftArray = array.slice(start, middle + 1);
  const rightArray = array.slice(middle + 1, end + 1);

  let i = 0;
  let j = 0;
  let k = start;

  while (i < leftArray.length && j < rightArray.length) {
    yield {
      array: [...array],
      currentIndex: start + i,
      compareIndex: middle + 1 + j,
    };

    if (leftArray[i] <= rightArray[j]) {
      array[k] = leftArray[i];
      i++;
    } else {
      array[k] = rightArray[j];
      j++;
    }
    k++;

    yield {
      array: [...array],
      currentIndex: k - 1,
      compareIndex: -1,
    };
  }

  while (i < leftArray.length) {
    array[k] = leftArray[i];
    yield {
      array: [...array],
      currentIndex: k,
      compareIndex: -1,
    };
    i++;
    k++;
  }

  while (j < rightArray.length) {
    array[k] = rightArray[j];
    yield {
      array: [...array],
      currentIndex: k,
      compareIndex: -1,
    };
    j++;
    k++;
  }

  return {
    array: [...array],
    currentIndex: -1,
    compareIndex: -1,
  };
}

function* mergeSortHelper(
  array: number[],
  start: number,
  end: number
): SortingGenerator {
  if (start < end) {
    const middle = Math.floor((start + end) / 2);

    yield* mergeSortHelper(array, start, middle);
    yield* mergeSortHelper(array, middle + 1, end);
    yield* merge(array, start, middle, end);
  }

  return {
    array: [...array],
    currentIndex: -1,
    compareIndex: -1,
  };
}

export function* mergeSort(array: number[]): SortingGenerator {
  const arr = [...array];
  yield* mergeSortHelper(arr, 0, arr.length - 1);

  return {
    array: [...arr],
    currentIndex: -1,
    compareIndex: -1,
  };
}
