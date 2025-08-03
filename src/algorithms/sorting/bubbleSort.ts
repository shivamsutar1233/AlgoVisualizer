export interface SortingStep {
  array: number[];
  currentIndex: number;
  compareIndex: number;
}

export type SortingGenerator = Generator<SortingStep, SortingStep, undefined>;

export const bubbleSort = function* (array: number[]): SortingGenerator {
  const arr = [...array];
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield {
        array: [...arr],
        currentIndex: j,
        compareIndex: j + 1
      };
      
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return {
    array: arr,
    currentIndex: -1,
    compareIndex: -1
  };
};
