import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useGame } from '@/hooks/useGame';

export const EndgameTypesScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { difficulty } = route.params;
  const { setDifficulty, setEndgameType } = useGame();
  const [endgameTypes, setEndgameTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEndgameTypes = async () => {
      try {
        const response = await fetch(`http://192.168.1.102:4000/endgames/${difficulty}`);
        if (!response.ok) {
          throw new Error('Failed to fetch endgame types');
        }
        const data = await response.json();
        setEndgameTypes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEndgameTypes();
  }, [difficulty]);

  const handlePress = (endgameType: string) => {
    setDifficulty(difficulty);
    setEndgameType(endgameType);
    navigation.navigate('Chessboard', { endgame: endgameType });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{difficulty} Endgames</Text>
      <FlatList
        data={endgameTypes}
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
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
});
