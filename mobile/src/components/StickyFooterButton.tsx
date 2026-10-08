import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Full-width action floating 18px above the bottom edge (Create post, Invite teammate). */
export function StickyFooterButton({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.wrap, { bottom: 18 + insets.bottom }]}>{children}</View>;
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 20, right: 20 },
});
