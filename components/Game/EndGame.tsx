import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { PieceSymbol, Square } from 'chess.js';
import { PieceName } from '@/constants/types';
import { SIZE, width } from '@/constants/Size';
import { getDifferentColor } from '@/utils/getDifferentColor';
import { useGame } from '@/hooks/useGame';
import { PromotionDialog } from '../PromotionDialog/PromotionDialog';
import { Piece } from '../Piece/Piece';
import { Board } from '../Board/Board';
import { Button } from '../Button/Button';
import { useNavigation } from '@react-navigation/native';

export const EndGame = () => {
  const {
    chess,
    highlightedPiece,
    setPossibleMoves,
    gameState,
    isPromoting,
    goNext,
    handleGoNext,
    campaignCompleted,
    setCampaignCompleted,
  } = useGame();
  const navigation = useNavigation();

  useEffect(() => {
    if (highlightedPiece) {
      const moves = chess.moves({
        piece: highlightedPiece.piece as PieceSymbol,
        square: highlightedPiece.from as Square,
      });
      setPossibleMoves(moves);
    }
  }, [highlightedPiece]);

  const handleComplete = () => {
    setCampaignCompleted(false);
    navigation.goBack();
  };
  return (
    <>
      <View style={styles.result}>
        {chess.isCheckmate() ? (
          <Text style={styles.text}>{chess.turn() === 'w' ? '0-1' : '1-0'}</Text>
        ) : null}
        {chess.isDraw() ? <Text style={styles.text}>1/2-1/2</Text> : null}
      </View>
      <View style={styles.board}>
        <Board />
        {gameState.board.map((row: any[], i: number) =>
          row.map((square, j) => {
            if (square === null) {
              return null;
            } else {
              return (
                <Piece
                  id={`${square.color}${square.type}` as PieceName}
                  position={{ x: j * SIZE, y: i * SIZE }}
                  key={`${square.color}${square.type}${j}${i}`}
                />
              );
            }
          }),
        )}
      </View>
      {isPromoting ? <PromotionDialog color={getDifferentColor(gameState.player)} /> : null}
      {goNext ? <Button label='Next' handlePress={() => handleGoNext()} /> : null}
      {campaignCompleted ? (
        <Button label='Complete campaign' handlePress={() => handleComplete()} />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    justifyContent: 'center',
  },
  board: {
    alignContent: 'center',
    alignSelf: 'center',
    width: width,
    height: width,
  },
  result: {
    alignContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
  },
});
