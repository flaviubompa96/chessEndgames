import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EndgameTypesScreen } from '@/screens/EndgameTypesScreen';

export default function EndgameTypesRoute() {
  const params = useLocalSearchParams<{ difficulty?: string }>();
  const router = useRouter();

  const navigation = {
    navigate: (name: string, routeParams?: Record<string, any>) => {
      if (name === 'Chessboard') {
        router.push({ pathname: '/Chessboard', params: routeParams });
      }
    },
  } as any;

  const route = { params: { difficulty: params.difficulty } } as any;

  return <EndgameTypesScreen route={route} navigation={navigation} />;
}


