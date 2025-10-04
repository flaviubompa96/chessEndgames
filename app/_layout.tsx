import React from 'react';
import { Stack } from 'expo-router';
import { GameProvider } from '@/hooks/useGame';

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </GameProvider>
  );
}
