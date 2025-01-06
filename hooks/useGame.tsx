import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { runOnJS } from 'react-native-reanimated';
import { Chess, Move } from 'chess.js';
import { useConst } from './useConst';
import { Game, HighilghtedPiece } from '@/constants/types';

interface GameContextProps {
  chess: Chess;
  gameState: Game;
  setGameState: (value: Game) => void;
  isPromoting: boolean;
  setIsPromoting: (value: boolean) => void;
  currentMove: Move | undefined;
  setCurrentMove: (value: Move) => void;
  highlightedPiece: HighilghtedPiece | null;
  setHighlightedPiece: (value: HighilghtedPiece | null) => void;
  possibleMoves: string[];
  setPossibleMoves: (value: string[]) => void;
  handleMove: (from: string, to: string, resetPosition: () => void) => void;
  handlePromotingPiece: (piece: string) => void;
  checkPossibleMove: (to: string) => boolean;
  checkPossibleCapturingMove: (to: string) => boolean;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const chess = useConst(() => new Chess());
  const wsRef = useRef<WebSocket | null>(null);

  const [gameState, setGameState] = useState<Game>({ player: 'w', board: chess.board() });
  const [isPromoting, setIsPromoting] = useState(false);
  const [currentMove, setCurrentMove] = useState<Move>();
  const [highlightedPiece, setHighlightedPiece] = useState<HighilghtedPiece | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.1.102:8080');
    wsRef.current = ws;

    ws.onopen = () => {};
    ws.onmessage = (event) => handleStockfishMove(event.data);
    ws.onclose = () => {};
    ws.onerror = (error) => console.error('WebSocket error:', error);

    return () => ws.close();
  }, []);

  const updateGameState = () => {
    setGameState({
      player: chess.turn(),
      board: chess.board(),
    });
  };

  const handleStockfishMove = (data: string) => {
    const move = chess.move(data);
    if (move) {
      updateGameState();
    } else {
      console.error(`Invalid move received from Stockfish: ${data}`);
    }
  };

  const handlePlayerMove = (from: string, to: string) => {
    const move = chess.move({ from, to });
    if (move) {
      updateGameState();
      wsRef.current?.send(`${from}${to}`);
    } else {
      console.error('Invalid player move');
    }
  };

  const handleMove = useCallback(
    (from: string, to: string, resetPosition: () => void) => {
      try {
        if (chess.turn() === 'w') {
          const move = chess.moves({ verbose: true }).find((m) => m.from === from && m.to === to);
          if (move) {
            if (move.piece === 'p' && ['1', '8'].includes(move.to[1])) {
              setIsPromoting(true);
              setCurrentMove(move);
            } else {
              handlePlayerMove(from, to);
            }
            clearHighlight();
          } else {
            resetPositionSafely(resetPosition);
          }
        } else {
          resetPositionSafely(resetPosition);
        }
      } catch {
        resetPositionSafely(resetPosition);
      }
    },
    [chess]
  );

  const resetPositionSafely = (resetPosition: () => void) => {
    runOnJS(resetPosition)();
  };

  const handlePromotingPiece = (piece: string) => {
    if (currentMove) {
      const move = chess.move({ ...currentMove, promotion: piece[1] });
      if (move) {
        updateGameState();
        wsRef.current?.send(`${move.from}${move.to}${piece[1].toLowerCase()}`);
      }
    }
    setIsPromoting(false);
  };

  const clearHighlight = () => {
    setHighlightedPiece(null);
    setPossibleMoves([]);
  };

  const checkPossibleMove = (to: string) => {
    return generateMovePatterns(to).some((item) => possibleMoves.includes(item));
  };

  const checkPossibleCapturingMove = (to: string) => {
    return generateCapturingPatterns(to).some((item) => possibleMoves.includes(item));
  };

  const generateMovePatterns = (to: string) => {
    const piece = highlightedPiece?.piece ?? '';
    const fromFile = highlightedPiece?.from[0] ?? '';
    const baseMove = piece === 'p' ? to : `${piece.toUpperCase()}${to}`;
    const capturingMove = piece === 'p' ? `${fromFile}x${to}` : `${piece.toUpperCase()}x${to}`;
    const castles = piece === 'k' && ['g8', 'c8', 'g1', 'c1'].includes(to) ? ['O-O', 'O-O-O'] : [];
    return [
      baseMove,
      capturingMove,
      `${baseMove}+`,
      `${baseMove}#`,
      `${capturingMove}+`,
      `${capturingMove}#`,
      ...promotionPatterns(baseMove),
      ...promotionPatterns(capturingMove),
      ...castles,
    ];
  };

  const promotionPatterns = (baseMove: string) => {
    return [`${baseMove}=Q`, `${baseMove}=Q+`, `${baseMove}=Q#`];
  };

  const generateCapturingPatterns = (to: string) => {
    const piece = highlightedPiece?.piece ?? '';
    const fromFile = highlightedPiece?.from[0] ?? '';
    const capturingMove = piece === 'p' ? `${fromFile}x${to}` : `${piece.toUpperCase()}x${to}`;
    return [
      capturingMove,
      `${capturingMove}+`,
      `${capturingMove}#`,
      ...promotionPatterns(capturingMove),
    ];
  };

  return (
    <GameContext.Provider
      value={{
        chess,
        gameState,
        setGameState,
        isPromoting,
        setIsPromoting,
        currentMove,
        setCurrentMove,
        highlightedPiece,
        setHighlightedPiece,
        possibleMoves,
        setPossibleMoves,
        handleMove,
        handlePromotingPiece,
        checkPossibleMove,
        checkPossibleCapturingMove,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

const useGame = (): GameContextProps => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};

export { GameProvider, useGame };
