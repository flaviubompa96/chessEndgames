import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Button
        title='Beginner'
        onPress={() => navigation.navigate('EndgameTypes', { difficulty: 'Beginner' })}
      />
      <Button
        title='Intermediate'
        onPress={() => navigation.navigate('EndgameTypes', { difficulty: 'Intermediate' })}
      />
      <Button
        title='Advanced'
        onPress={() => navigation.navigate('EndgameTypes', { difficulty: 'Advanced' })}
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
