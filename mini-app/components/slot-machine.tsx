"use client";

import { useState, useEffect } from "react";
import { title, description, url } from "@/lib/metadata";
import Share from "@/components/share";

const fruits = ["Apple", "Banana", "Cherry", "Orange", "Lemon"] as const;
type Fruit = typeof fruits[number];

const getRandomFruit = (): Fruit => fruits[Math.floor(Math.random() * fruits.length)];

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit)));
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWin(false);
    const interval = setInterval(() => {
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]);
        // shift rows down
        newGrid[2] = newGrid[1];
        newGrid[1] = newGrid[0];
        newGrid[0] = Array.from({ length: 3 }, getRandomFruit);
        return newGrid;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      // check center row
      const center = grid[1];
      if (center[0] === center[1] && center[1] === center[2]) {
        setWin(true);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <div key={idx} className="flex items-center justify-center w-16 h-16 border rounded">
            <img src={`/${fruit.toLowerCase()}.png`} alt={fruit} width={48} height={48} />
          </div>
        ))}
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="px-4 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50"
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {win && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-green-600 font-semibold">You win!</span>
          <Share
            text={`${title} - ${description} ${url}`}
            url={url}
          />
        </div>
      )}
    </div>
  );
}
