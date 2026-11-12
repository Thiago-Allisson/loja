import React from 'react';

// Generates an aesthetically authentic QR Code SVG matrix
interface PixQrCodeProps {
  value: string;
  size?: number;
}

export const PixQrCode: React.FC<PixQrCodeProps> = ({ value, size = 180 }) => {
  // Generate a reproducible 25x25 pseudo-QR pattern with standard finder patterns
  const gridSize = 25;
  const matrix: boolean[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));

  // Finder pattern at (row, col)
  const drawFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const isBorder = i === 0 || i === 6 || j === 0 || j === 6;
        const isCenter = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        matrix[r + i][c + j] = isBorder || isCenter;
      }
    }
  };

  drawFinder(0, 0); // top-left
  drawFinder(0, gridSize - 7); // top-right
  drawFinder(gridSize - 7, 0); // bottom-left

  // Timing patterns
  for (let i = 7; i < gridSize - 7; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Fill data cells reproducibly with pseudo-random hash from value
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Skip finder zones
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= gridSize - 8) ||
        (r >= gridSize - 8 && c < 8) ||
        r === 6 ||
        c === 6
      ) {
        continue;
      }
      const pseudoVal = (Math.sin(hash * 0.1 + r * 13 + c * 17) * 10000) % 1;
      matrix[r][c] = pseudoVal > 0.45;
    }
  }

  const cellSize = size / gridSize;

  return (
    <div className="p-3 bg-white border border-stone-200 rounded-lg inline-block shadow-sm">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="#ffffff" />
        {matrix.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize + 0.1}
                height={cellSize + 0.1}
                fill="#1c1917"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
