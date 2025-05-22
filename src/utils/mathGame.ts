// Define types for our game
export type MathOperation = "+" | "-" | "×" | "÷";
export type CellState = {
  value: number;
  disabled: boolean;
};

// Function to generate random numbers for the grid
export const generateGrid = (): CellState[][] => {
  const grid: CellState[][] = [];
  for (let i = 0; i < 5; i++) {
    const row: CellState[] = [];
    for (let j = 0; j < 5; j++) {
      row.push({
        value: Math.floor(Math.random() * 10) + 1, // Random number between 1 and 10
        disabled: false,
      });
    }
    grid.push(row);
  }
  return grid;
};

// Function to calculate the result of a math operation
export const calculateResult = (a: number, b: number, operation: MathOperation): number => {
  switch (operation) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return a / b;
    default:
      return 0;
  }
};

// Function to find the maximum possible score
export const calculateMaxPossibleScore = (grid: CellState[][]): number => {
  // This is a simplified approach - in a real game, you might want a more sophisticated algorithm
  // For this example, we'll just use the product of the two highest numbers for each operation
  const allNumbers: number[] = [];
  
  // Flatten the grid to get all numbers
  grid.forEach(row => {
    row.forEach(cell => {
      allNumbers.push(cell.value);
    });
  });
  
  // Sort in descending order
  allNumbers.sort((a, b) => b - a);
  
  // Calculate max score (using the 4 operations with the highest numbers)
  let maxScore = 0;
  
  // Addition: use the two highest numbers
  if (allNumbers.length >= 2) {
    maxScore += allNumbers[0] + allNumbers[1];
  }
  
  // Multiplication: use the next two highest numbers
  if (allNumbers.length >= 4) {
    maxScore += allNumbers[2] * allNumbers[3];
  }
  
  // Subtraction: use the next two highest numbers (larger minus smaller)
  if (allNumbers.length >= 6) {
    maxScore += Math.max(allNumbers[4], allNumbers[5]) - Math.min(allNumbers[4], allNumbers[5]);
  }
  
  // Division: use the next two highest numbers (larger divided by smaller)
  if (allNumbers.length >= 8) {
    const larger = Math.max(allNumbers[6], allNumbers[7]);
    const smaller = Math.min(allNumbers[6], allNumbers[7]);
    if (smaller !== 0) {
      maxScore += larger / smaller;
    }
  }
  
  return maxScore;
};