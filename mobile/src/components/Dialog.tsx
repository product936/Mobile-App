import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { useReducedMotion } from '@/lib/useReducedMotion';
import { colors, motion } from '@/theme/tokens';

/**
 * Centered dialog over a dimmed backdrop. Tapping the backdrop dismisses it.
 * `pop` scales in slightly (confirmations); `fade` only fades (version history).
 */
export function Dialog({
  visible,
  onDismiss,
  children,
  animation = 'pop',
  horizontalInset = 24,
  role = 'alert',
  style,
}: {
  visible: boolean;
  onDismiss: () => void;
  children: ReactNode;
  animation?: 'pop' | 'fade';
  horizontalInset?: number;
  role?: 'alert' | 'none';
  style?: StyleProp<ViewStyle>;
}) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: reduced ? 0 : animation === 'pop' ? 200 : 180,
      easing: motion.easeOut,
      useNativeDriver: true,
    }).start();
  }, [visible, reduced, animation, progress]);

  const scale = animation === 'pop' ? progress.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) : 1;

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onDismiss}>
      <Pressable style={styles.scrim} onPress={onDismiss} accessibilityLabel="Dismiss" accessibilityRole="button" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.center, { paddingHorizontal: horizontalInset }]}
        pointerEvents="box-none"
      >
        <Animated.View
          accessibilityViewIsModal
          accessibilityRole={role === 'alert' ? 'alert' : undefined}
          style={[styles.card, style, { opacity: progress, transform: [{ scale }] }]}
        >
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const fill = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as const;

const styles = StyleSheet.create({
  scrim: { ...fill, backgroundColor: colors.scrimStrong },
  center: { ...fill, alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', backgroundColor: colors.surfaceElevated },
});
