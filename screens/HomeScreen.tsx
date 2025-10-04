import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Button
        title='Beginner'
        onPress={() => router.push({ pathname: '/EndgameTypes', params: { difficulty: 'Beginner' } })}
      />
      <Button
        title='Intermediate'
        onPress={() => router.push({ pathname: '/EndgameTypes', params: { difficulty: 'Intermediate' } })}
      />
      <Button
        title='Advanced'
        onPress={() => router.push({ pathname: '/EndgameTypes', params: { difficulty: 'Advanced' } })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});
