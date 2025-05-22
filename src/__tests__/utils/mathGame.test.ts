import { 
  generateGrid, 
  calculateResult, 
  calculateMaxPossibleScore,
  CellState,
  MathOperation
} from '@/utils/mathGame';

describe('generateGrid', () => {
  test('should generate a 5x5 grid', () => {
    const grid = generateGrid();
    expect(grid.length).toBe(5);
    grid.forEach(row => {
      expect(row.length).toBe(5);
    });
  });

  test('should generate grid with numbers between 1 and 10', () => {
    const grid = generateGrid();
    grid.forEach(row => {
      row.forEach(cell => {
        expect(cell.value).toBeGreaterThanOrEqual(1);
        expect(cell.value).toBeLessThanOrEqual(10);
      });
    });
  });

  test('should generate grid with all cells enabled', () => {
    const grid = generateGrid();
    grid.forEach(row => {
      row.forEach(cell => {
        expect(cell.disabled).toBe(false);
      });
    });
  });
});

describe('calculateResult', () => {
  test('should correctly add two numbers', () => {
    expect(calculateResult(5, 3, '+')).toBe(8);
    expect(calculateResult(10, 7, '+')).toBe(17);
  });

  test('should correctly subtract two numbers', () => {
    expect(calculateResult(5, 3, '-')).toBe(2);
    expect(calculateResult(7, 10, '-')).toBe(-3);
  });

  test('should correctly multiply two numbers', () => {
    expect(calculateResult(5, 3, '×')).toBe(15);
    expect(calculateResult(7, 10, '×')).toBe(70);
  });

  test('should correctly divide two numbers', () => {
    expect(calculateResult(6, 3, '÷')).toBe(2);
    expect(calculateResult(10, 4, '÷')).toBe(2.5);
  });

  test('should handle invalid operations', () => {
    // Using type assertion to test with an invalid operation
    expect(calculateResult(5, 3, '%' as MathOperation)).toBe(0);
  });
});

describe('calculateMaxPossibleScore', () => {
  test('should calculate max score for a grid with known values', () => {
    // Create a grid with known values to test the calculation
    const grid: CellState[][] = [
      [{ value: 10, disabled: false }, { value: 9, disabled: false }],
      [{ value: 8, disabled: false }, { value: 7, disabled: false }],
      [{ value: 6, disabled: false }, { value: 5, disabled: false }],
      [{ value: 4, disabled: false }, { value: 3, disabled: false }],
      [{ value: 2, disabled: false }, { value: 1, disabled: false }],
    ];
    
    // Expected calculation:
    // Addition: 10 + 9 = 19
    // Multiplication: 8 * 7 = 56
    // Subtraction: 6 - 5 = 1
    // Division: 4 / 3 = 1.333...
    // Total: 19 + 56 + 1 + 1.333... = 77.333...
    
    const expectedMaxScore = 19 + 56 + 1 + (4/3);
    expect(calculateMaxPossibleScore(grid)).toBeCloseTo(expectedMaxScore);
  });

  test('should handle empty grid', () => {
    const emptyGrid: CellState[][] = [];
    expect(calculateMaxPossibleScore(emptyGrid)).toBe(0);
  });

  test('should handle grid with fewer than 8 cells', () => {
    // Create a grid with only 6 cells
    const smallGrid: CellState[][] = [
      [{ value: 10, disabled: false }, { value: 9, disabled: false }],
      [{ value: 8, disabled: false }, { value: 7, disabled: false }],
      [{ value: 6, disabled: false }, { value: 5, disabled: false }],
    ];
    
    // Expected calculation:
    // Addition: 10 + 9 = 19
    // Multiplication: 8 * 7 = 56
    // Subtraction: 6 - 5 = 1
    // Division: not enough cells
    // Total: 19 + 56 + 1 = 76
    
    const expectedMaxScore = 19 + 56 + 1;
    expect(calculateMaxPossibleScore(smallGrid)).toBe(expectedMaxScore);
  });
});