import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { SafeAreaInsetsContext, SafeAreaProvider, type EdgeInsets } from 'react-native-safe-area-context';

import { fontAssets } from '@/theme/fonts';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

/**
 * In the web preview's phone mockup there is no real notch or home indicator,
 * so the page supplies the device's safe-area insets (iPhone 15 Pro Max).
 */
const previewInsets: EdgeInsets | undefined =
  Platform.OS === 'web' && typeof window !== 'undefined'
    ? (window as unknown as { __CONNECT_PREVIEW_INSETS__?: EdgeInsets }).__CONNECT_PREVIEW_INSETS__
    : undefined;

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <PreviewInsets>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surfaceBase } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" options={{ animation: 'fade' }} />
          <Stack.Screen name="verify" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="(app)" options={{ animation: 'fade' }} />
        </Stack>
      </PreviewInsets>
    </SafeAreaProvider>
  );
}

function PreviewInsets({ children }: { children: React.ReactNode }) {
  if (!previewInsets) return <>{children}</>;
  return <SafeAreaInsetsContext.Provider value={previewInsets}>{children}</SafeAreaInsetsContext.Provider>;
}
