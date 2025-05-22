import React, { useState, useEffect } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MathOperation, 
  CellState, 
  generateGrid, 
  calculateResult, 
  calculateMaxPossibleScore 
} from "@/utils/mathGame";

type GameState = {
  grid: CellState[][];
  operations: MathOperation[];
  selectedCells: [number, number][];
  selectedOperation: MathOperation | null;
  score: number;
  maxPossibleScore: number | null;
  gameOver: boolean;
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    operations: ["+", "-", "×", "÷"],
    selectedCells: [],
    selectedOperation: null,
    score: 0,
    maxPossibleScore: null,
    gameOver: false,
  });

  // Initialize the game
  useEffect(() => {
    resetGame();
  }, []);

  // Reset the game
  const resetGame = () => {
    const newGrid = generateGrid();
    setGameState({
      grid: newGrid,
      operations: ["+", "-", "×", "÷"],
      selectedCells: [],
      selectedOperation: null,
      score: 0,
      maxPossibleScore: calculateMaxPossibleScore(newGrid),
      gameOver: false,
    });
  };

  // Handle cell selection
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (gameState.gameOver || gameState.grid[rowIndex][colIndex].disabled) {
      return;
    }

    const newSelectedCells = [...gameState.selectedCells];
    
    // If cell is already selected, deselect it
    const existingIndex = newSelectedCells.findIndex(
      ([r, c]) => r === rowIndex && c === colIndex
    );
    
    if (existingIndex !== -1) {
      newSelectedCells.splice(existingIndex, 1);
    } else {
      // Add cell to selection (max 2 cells)
      if (newSelectedCells.length < 2) {
        newSelectedCells.push([rowIndex, colIndex]);
      } else {
        // Replace the first cell with the new one
        newSelectedCells.shift();
        newSelectedCells.push([rowIndex, colIndex]);
      }
    }

    setGameState({
      ...gameState,
      selectedCells: newSelectedCells,
    });
  };

  // Handle operation selection
  const handleOperationClick = (operation: MathOperation) => {
    if (gameState.gameOver) {
      return;
    }

    setGameState({
      ...gameState,
      selectedOperation: operation,
    });
  };

  // Apply the selected operation
  const applyOperation = () => {
    if (
      gameState.selectedCells.length !== 2 ||
      !gameState.selectedOperation ||
      gameState.gameOver
    ) {
      return;
    }

    const [row1, col1] = gameState.selectedCells[0];
    const [row2, col2] = gameState.selectedCells[1];
    
    const value1 = gameState.grid[row1][col1].value;
    const value2 = gameState.grid[row2][col2].value;
    
    // Check for division by zero
    if (gameState.selectedOperation === "÷" && value2 === 0) {
      alert("Cannot divide by zero!");
      return;
    }

    // Calculate result
    const result = calculateResult(value1, value2, gameState.selectedOperation);
    
    // Update grid to disable used cells
    const newGrid = [...gameState.grid];
    newGrid[row1][col1].disabled = true;
    newGrid[row2][col2].disabled = true;
    
    // Remove the used operation
    const newOperations = gameState.operations.filter(
      op => op !== gameState.selectedOperation
    );
    
    // Check if game is over
    const isGameOver = newOperations.length === 0;
    
    setGameState({
      ...gameState,
      grid: newGrid,
      operations: newOperations,
      selectedCells: [],
      selectedOperation: null,
      score: gameState.score + result,
      gameOver: isGameOver,
    });
  };

  return (
    <>
      <Head>
        <title>Math Game</title>
        <meta name="description" content="A fun math game to test your skills" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Math Game</CardTitle>
              <CardDescription>
                Select two numbers and an operation to score points. Try to get the highest score possible!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Score display */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium">Score:</span>
                  <Badge variant="secondary" className="ml-2 text-lg">
                    {gameState.score.toFixed(2)}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={resetGame}>
                  Restart
                </Button>
              </div>

              {/* Game grid */}
              <div className="grid grid-cols-5 gap-2">
                {gameState.grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <Button
                      key={`${rowIndex}-${colIndex}`}
                      variant={
                        gameState.selectedCells.some(
                          ([r, c]) => r === rowIndex && c === colIndex
                        )
                          ? "default"
                          : "outline"
                      }
                      className={`h-12 ${cell.disabled ? "opacity-50" : ""}`}
                      disabled={cell.disabled}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {cell.value}
                    </Button>
                  ))
                )}
              </div>

              {/* Operations */}
              <div className="flex justify-center gap-2 mt-4">
                {gameState.operations.map((op) => (
                  <Button
                    key={op}
                    variant={gameState.selectedOperation === op ? "default" : "outline"}
                    className="w-12 h-12 text-xl"
                    onClick={() => handleOperationClick(op)}
                  >
                    {op}
                  </Button>
                ))}
              </div>

              {/* Apply button */}
              <Button
                className="w-full mt-4"
                disabled={
                  gameState.selectedCells.length !== 2 || !gameState.selectedOperation
                }
                onClick={applyOperation}
              >
                Apply Operation
              </Button>

              {/* Game over message */}
              {gameState.gameOver && gameState.maxPossibleScore !== null && (
                <Alert>
                  <AlertDescription>
                    Game Over! Your score: {gameState.score.toFixed(2)}
                    <br />
                    Maximum possible score: {gameState.maxPossibleScore.toFixed(2)}
                    <br />
                    Difference: {(gameState.maxPossibleScore - gameState.score).toFixed(2)}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Select two numbers and an operation, then click Apply
              </p>
            </CardFooter>
          </Card>
        </main>
      </div>
    </>
  );
}