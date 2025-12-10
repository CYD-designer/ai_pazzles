import React, { useState, useEffect } from 'react';
import { LevelData, Tile } from '../types';

interface PuzzleBoardProps {
  level: LevelData;
  onWin: () => void;
  hintTrigger: number; // Increment this to trigger a hint
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ level, onWin, hintTrigger }) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTileId, setSelectedTileId] = useState<number | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);

  // Initialize board
  useEffect(() => {
    initializeBoard();
  }, [level]);

  // Handle Hint Trigger
  useEffect(() => {
    if (hintTrigger > 0) {
      applyHint();
    }
  }, [hintTrigger]);

  const initializeBoard = () => {
    const totalTiles = level.gridSize * level.gridSize;
    const initialTiles: Tile[] = Array.from({ length: totalTiles }, (_, index) => ({
      id: index,
      currentPos: index,
    }));

    // Shuffle
    const shuffled = [...initialTiles];
    // Simple Fisher-Yates shuffle for positions
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap currentPos
      const tempPos = shuffled[i].currentPos;
      shuffled[i].currentPos = shuffled[j].currentPos;
      shuffled[j].currentPos = tempPos;
    }

    setTiles(shuffled);
    setSelectedTileId(null);
  };

  const applyHint = () => {
    // Find up to 3 tiles that are NOT in their correct position
    setTiles(prev => {
      const newTiles = prev.map(t => ({ ...t }));
      
      // Filter tiles where id !== currentPos
      const misplaced = newTiles.filter(t => t.id !== t.currentPos);
      
      if (misplaced.length === 0) return newTiles;

      // Take up to 3
      const toFix = misplaced.slice(0, 3);

      toFix.forEach(tileToFix => {
        // We need to move tileToFix to position `tileToFix.id`
        // 1. Find the tile currently occupying `tileToFix.id`
        const occupant = newTiles.find(t => t.currentPos === tileToFix.id);
        
        if (occupant) {
          // Swap positions
          const tempPos = tileToFix.currentPos;
          tileToFix.currentPos = tileToFix.id; // Place correct one
          occupant.currentPos = tempPos; // Move occupant to the old spot
        }
      });

      return newTiles;
    });

    // Clean up selection
    setSelectedTileId(null);
  };

  const handleTileClick = (clickedTile: Tile) => {
    if (isSwapping) return;

    if (selectedTileId === null) {
      setSelectedTileId(clickedTile.id);
    } else {
      if (selectedTileId === clickedTile.id) {
        setSelectedTileId(null); // Deselect
      } else {
        swapTiles(selectedTileId, clickedTile.id);
      }
    }
  };

  const swapTiles = (id1: number, id2: number) => {
    setIsSwapping(true);
    
    setTiles(prev => {
      const newTiles = prev.map(t => ({ ...t }));
      const tile1 = newTiles.find(t => t.id === id1);
      const tile2 = newTiles.find(t => t.id === id2);

      if (tile1 && tile2) {
        const tempPos = tile1.currentPos;
        tile1.currentPos = tile2.currentPos;
        tile2.currentPos = tempPos;
      }
      
      return newTiles;
    });

    setTimeout(() => {
      setIsSwapping(false);
      setSelectedTileId(null);
    }, 300);
  };

  // Check win condition whenever tiles change
  useEffect(() => {
    if (tiles.length === 0) return;
    const isWin = tiles.every(tile => tile.id === tile.currentPos);
    if (isWin) {
      // Small delay for visual satisfaction
      const timer = setTimeout(() => {
        onWin();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [tiles, onWin]);

  // Generate a dynamic gradient style for each tile based on its ORIGINAL ID
  const getTileStyle = (originalId: number) => {
    const size = level.gridSize;
    const row = Math.floor(originalId / size);
    const col = originalId % size;
    
    // Calculate percentage positions for background
    const xPos = (col / (size - 1)) * 100;
    const yPos = (row / (size - 1)) * 100;
    
    // Use the level colors to create a CSS gradient background
    const gradient = `linear-gradient(135deg, ${level.colors[0]}, ${level.colors[1]}, ${level.colors[2]}, ${level.colors[3]})`;
    
    return {
      background: gradient,
      backgroundSize: `${size * 100}% ${size * 100}%`,
      backgroundPosition: `${xPos}% ${yPos}%`,
    };
  };

  // Determine grid template
  const gridStyle = {
    gridTemplateColumns: `repeat(${level.gridSize}, 1fr)`,
  };

  // We render slots 0..N-1. In each slot, we find the tile that has currentPos === slotIndex
  const renderSlots = [];
  const totalSlots = level.gridSize * level.gridSize;

  for (let i = 0; i < totalSlots; i++) {
    const tile = tiles.find(t => t.currentPos === i);
    if (!tile) continue;

    const isSelected = selectedTileId === tile.id;
    const isCorrect = tile.id === tile.currentPos;

    renderSlots.push(
      <div 
        key={tile.id}
        onClick={() => handleTileClick(tile)}
        className={`
          aspect-square rounded-xl cursor-pointer relative overflow-hidden transition-all duration-300
          shadow-sm border-2 
          ${isSelected ? 'border-white scale-95 ring-4 ring-brand-purple z-10' : 'border-transparent hover:scale-[1.02]'}
          ${isCorrect && !isSelected ? 'border-transparent' : ''}
        `}
      >
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={getTileStyle(tile.id)}
        >
          {/* Optional: Add a subtle overlay pattern (circles, stripes) based on theme to make it look "puzzley" */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
        </div>

        {/* Debug/Helper Number */}
        <span className={`absolute top-1 left-2 font-display font-bold text-white drop-shadow-md text-opacity-50 text-sm
          ${isCorrect ? 'opacity-0' : 'opacity-60'}
        `}>
          {tile.id + 1}
        </span>
        
        {/* Success Checkmark */}
        {isCorrect && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md aspect-square mx-auto p-2 bg-white rounded-3xl shadow-2xl ring-8 ring-white/50">
      <div className="grid gap-2 h-full w-full" style={gridStyle}>
        {renderSlots}
      </div>
    </div>
  );
};

export default PuzzleBoard;
