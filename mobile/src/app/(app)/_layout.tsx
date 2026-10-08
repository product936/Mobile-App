import { Redirect, Stack } from 'expo-router';

import { GlobalSheets } from '@/sheets/GlobalSheets';
import { useAppStore } from '@/state/store';
import { colors } from '@/theme/tokens';

/** Signed-in area. Sheets live here so any screen can open them over the tab bar. */
export default function AppLayout() {
  const signedIn = useAppStore((s) => s.role !== null);
  if (!signedIn) return <Redirect href="/login" />;

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.surfaceBase },
        }}
      >
        <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      </Stack>
      <GlobalSheets />
    </>
  );
}
