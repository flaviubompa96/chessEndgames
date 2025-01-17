import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@/screens/HomeScreen';
import { EndgameTypesScreen } from '@/screens/EndgameTypesScreen';
import { ChessboardScreen } from '@/screens/ChessboardScreen';
import { GameProvider } from '@/hooks/useGame';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <GameProvider>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='EndgameTypes' component={EndgameTypesScreen} />
            <Stack.Screen name='Chessboard' component={ChessboardScreen} />
          </Stack.Navigator>
        </GameProvider>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
