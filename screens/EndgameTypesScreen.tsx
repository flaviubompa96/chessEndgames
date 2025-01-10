import { useGame } from '@/hooks/useGame';
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export const EndgameTypesScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { difficulty } = route.params;
  const { setDifficulty, setEndgameType } = useGame();

  const endgameTypes = {
    Beginner: ['Basic Checkmate', 'Advanced Checkmate'],
    Intermediate: ['Rook vs Pawn', 'Minor Piece Endgame'],
    Advanced: ['Queen vs Rook', 'Complex Rook Endgame'],
  };

  const data = endgameTypes[difficulty];

  const handlePress = (endgameType: string) => {
    setDifficulty(difficulty);
    setEndgameType(endgameType);
    navigation.navigate('Chessboard', { endgame: endgameType });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{difficulty} Endgames</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <Text style={styles.item}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  item: {
    fontSize: 18,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});
