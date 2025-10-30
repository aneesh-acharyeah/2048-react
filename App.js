import React, { useState, useEffect } from "react";

const SIZE = 4;

const getEmptyBoard = () =>
  Array(SIZE)
    .fill(null)
    .map(() => Array(SIZE).fill(0));

const addRandomTile = (board) => {
  const emptyPositions = [];
  board.forEach((row, r) =>
    row.forEach((val, c) => {
      if (val === 0) emptyPositions.push([r, c]);
    })
  );
  if (emptyPositions.length === 0) return board;
  const [r, c] = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  const newBoard = board.map((row) => row.slice());
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
};

const rotateBoard = (board) => {
  const newBoard = getEmptyBoard();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      newBoard[c][SIZE - 1 - r] = board[r][c];
    }
  }
  return newBoard;
};

const moveLeft = (board) => {
  let newBoard = getEmptyBoard();
  let score = 0;

  for (let r = 0; r < SIZE; r++) {
    let line = board[r].filter((v) => v !== 0);
    for (let i = 0; i < line.length - 1; i++) {
      if (line[i] === line[i + 1]) {
        line[i] *= 2;
        score += line[i];
        line[i + 1] = 0;
      }
    }
    line = line.filter((v) => v !== 0);
    for (let i = 0; i < line.length; i++) {
      newBoard[r][i] = line[i];
    }
  }
  return { newBoard, score };
};

const boardsEqual = (b1, b2) => {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (b1[r][c] !== b2[r][c]) return false;
    }
  }
  return true;
};

const getTileColor = (value) => {
  const colors = {
    0: "#cdc1b4",
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e",
  };
  return colors[value] || "#3c3a32";
};

const getFontSize = (value) => {
  if (value < 100) return "2rem";
  if (value < 1000) return "1.7rem";
  return "1.2rem";
};

export default function Game2048() {
  const [board, setBoard] = useState(() => addRandomTile(addRandomTile(getEmptyBoard())));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const keyDownHandler = (e) => {
    if (gameOver) return;
    let rotated = board;
    let moves = { ArrowUp: 1, ArrowRight: 2, ArrowDown: 3, ArrowLeft: 0 };
    if (!(e.key in moves)) return;
    const times = moves[e.key];
    for (let i = 0; i < times; i++) {
      rotated = rotateBoard(rotated);
    }
    let { newBoard, score: gained } = moveLeft(rotated);
    for (let i = 0; i < (4 - times) % 4; i++) {
      newBoard = rotateBoard(newBoard);
    }
    if (!boardsEqual(board, newBoard)) {
      const boardWithNewTile = addRandomTile(newBoard);
      setBoard(boardWithNewTile);
      setScore((s) => s + gained);
    }
  };

  const isGameOver = (b) => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (b[r][c] === 0) return false;
        if (c < SIZE - 1 && b[r][c] === b[r][c + 1]) return false;
        if (r < SIZE - 1 && b[r][c] === b[r + 1][c]) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    return () => window.removeEventListener("keydown", keyDownHandler);
  });

  useEffect(() => {
    if (isGameOver(board)) setGameOver(true);
  }, [board]);

  return (
    <div
      style={{
        maxWidth: 350,
        margin: "20px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        userSelect: "none",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#776e65" }}>2048</h1>
      <div
        style={{
          backgroundColor: "#bbada0",
          borderRadius: 10,
          padding: 16,
          boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${SIZE}, 75px)`,
            gridGap: 12,
          }}
        >
          {board.flat().map((cell, i) => (
            <div
              key={i}
              style={{
                width: 75,
                height: 75,
                backgroundColor: getTileColor(cell),
                color: cell > 4 ? "#f9f6f2" : "#776e65",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: getFontSize(cell),
                fontWeight: "700",
                borderRadius: 6,
                boxShadow:
                  cell !== 0 ? "inset 0 4px 6px rgba(255,255,255,0.3)" : "none",
                transition: "background-color 0.3s ease",
              }}
            >
              {cell !== 0 ? cell : ""}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: "1.2rem",
          fontWeight: "bold",
          color: "#776e65",
          textAlign: "center",
        }}
      >
        Score: {score}
      </div>
      {gameOver && (
        <div
          style={{
            marginTop: 20,
            color: "#f33",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "1.3rem",
          }}
        >
          Game Over!
        </div>
      )}
      <p
        style={{
          marginTop: 14,
          fontSize: "0.9rem",
          color: "#776e65",
          textAlign: "center",
        }}
      >
        Use arrow keys to move tiles. Merge to get 2048!
      </p>
    </div>
  );
}
