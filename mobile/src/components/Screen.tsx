import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/tokens';

/** Full-screen container on the blue-tinted page background, padded below the status bar. */
export function Screen({
  children,
  bottomInset = false,
  style,
}: {
  children: ReactNode;
  /** Pad for the home indicator on screens without a tab bar. */
  bottomInset?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: bottomInset ? insets.bottom : 0 }, style]}>
      {children}
    </View>
  );
}

/** Vertical scroll body with the app's default content padding (4 / 20 / 20). */
export function ScrollBody({
  children,
  contentStyle,
}: {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={[styles.content, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

export function Spacer({ h }: { h: number }) {
  return <View style={{ height: h }} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surfaceBase },
  fill: { flex: 1 },
  content: { paddingTop: 4, paddingHorizontal: 20, paddingBottom: 20 },
});
