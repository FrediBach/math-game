import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '@/pages/index';
import * as mathGameUtils from '@/utils/mathGame';

// Mock the utility functions
jest.mock('@/utils/mathGame', () => {
  const originalModule = jest.requireActual('@/utils/mathGame');
  return {
    __esModule: true,
    ...originalModule,
    generateGrid: jest.fn(),
    calculateMaxPossibleScore: jest.fn(),
  };
});

// Mock the Header component
jest.mock('@/components/Header', () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Header</div>;
  };
});

describe('Home', () => {
  beforeEach(() => {
    // Create a mock grid with predictable values for testing
    const mockGrid = [
      [
        { value: 5, disabled: false },
        { value: 3, disabled: false },
        { value: 7, disabled: false },
        { value: 2, disabled: false },
        { value: 9, disabled: false },
      ],
      [
        { value: 4, disabled: false },
        { value: 6, disabled: false },
        { value: 1, disabled: false },
        { value: 8, disabled: false },
        { value: 10, disabled: false },
      ],
      [
        { value: 2, disabled: false },
        { value: 7, disabled: false },
        { value: 3, disabled: false },
        { value: 5, disabled: false },
        { value: 4, disabled: false },
      ],
      [
        { value: 9, disabled: false },
        { value: 1, disabled: false },
        { value: 6, disabled: false },
        { value: 10, disabled: false },
        { value: 8, disabled: false },
      ],
      [
        { value: 3, disabled: false },
        { value: 5, disabled: false },
        { value: 2, disabled: false },
        { value: 7, disabled: false },
        { value: 4, disabled: false },
      ],
    ];
    
    // Mock the generateGrid function to return our test grid
    (mathGameUtils.generateGrid as jest.Mock).mockReturnValue(mockGrid);
    
    // Mock the calculateMaxPossibleScore function
    (mathGameUtils.calculateMaxPossibleScore as jest.Mock).mockReturnValue(100);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the game title and description', () => {
    render(<Home />);
    
    expect(screen.getByText('Math Game')).toBeInTheDocument();
    expect(screen.getByText(/Select two numbers and an operation to score points/i)).toBeInTheDocument();
  });

  test('renders the game grid with 25 cells', () => {
    render(<Home />);
    
    // Find all buttons in the grid (excluding operation buttons and Apply button)
    const gridCells = screen.getAllByRole('button').filter(
      button => !['Apply Operation', '+', '-', '×', '÷', 'Restart'].includes(button.textContent || '')
    );
    
    expect(gridCells.length).toBe(25);
  });

  test('renders the operation buttons', () => {
    render(<Home />);
    
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('×')).toBeInTheDocument();
    expect(screen.getByText('÷')).toBeInTheDocument();
  });

  test('Apply Operation button is disabled initially', () => {
    render(<Home />);
    
    const applyButton = screen.getByText('Apply Operation');
    expect(applyButton).toBeDisabled();
  });

  test('selecting two cells and an operation enables the Apply button', () => {
    render(<Home />);
    
    // Find all grid cells
    const gridCells = screen.getAllByRole('button').filter(
      button => !['Apply Operation', '+', '-', '×', '÷', 'Restart'].includes(button.textContent || '')
    );
    
    // Select two cells
    fireEvent.click(gridCells[0]);
    fireEvent.click(gridCells[1]);
    
    // Select an operation
    fireEvent.click(screen.getByText('+'));
    
    // Check if Apply button is enabled
    const applyButton = screen.getByText('Apply Operation');
    expect(applyButton).not.toBeDisabled();
  });

  test('clicking Restart button resets the game', () => {
    render(<Home />);
    
    // Verify generateGrid was called once during initial render
    expect(mathGameUtils.generateGrid).toHaveBeenCalledTimes(1);
    
    // Click restart button
    fireEvent.click(screen.getByText('Restart'));
    
    // Verify generateGrid was called again
    expect(mathGameUtils.generateGrid).toHaveBeenCalledTimes(2);
  });

  test('game flow: select cells, operation, apply, cells become disabled', () => {
    render(<Home />);
    
    // Find all grid cells
    const gridCells = screen.getAllByRole('button').filter(
      button => !['Apply Operation', '+', '-', '×', '÷', 'Restart'].includes(button.textContent || '')
    );
    
    // Select two cells
    fireEvent.click(gridCells[0]);
    fireEvent.click(gridCells[1]);
    
    // Select an operation
    fireEvent.click(screen.getByText('+'));
    
    // Apply the operation
    fireEvent.click(screen.getByText('Apply Operation'));
    
    // The selected cells should now be disabled
    expect(gridCells[0]).toHaveClass('opacity-50');
    expect(gridCells[1]).toHaveClass('opacity-50');
  });
});