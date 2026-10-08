import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { fontAssets } from '@/theme/fonts';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surfaceBase } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
        <Stack.Screen name="verify" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="(app)" options={{ animation: 'fade' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
