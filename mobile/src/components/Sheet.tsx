import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

import { Text } from '@/components/Text';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { colors, motion, radius, shadows, type } from '@/theme/tokens';

type SheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Fixed height as a fraction of the screen (e.g. 0.86). */
  heightRatio?: number;
  /** Maximum height as a fraction of the screen when the sheet sizes to content. */
  maxHeightRatio?: number;
  accessibilityLabel?: string;
};

/**
 * Bottom sheet: dimmed, lightly blurred backdrop that fades in, and a sheet
 * that slides up on the iOS sheet curve (300ms). Tapping the backdrop closes it.
 */
export function Sheet({ visible, onClose, children, heightRatio, maxHeightRatio, accessibilityLabel }: SheetProps) {
  const { height: windowH } = useWindowDimensions();
  // Size against the space the sheet actually has (the window on a phone; the
  // device frame in the web preview), measured once the modal lays out.
  const [hostH, setHostH] = useState<number | null>(null);
  const screenH = hostH ?? windowH;
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: reduced ? 0 : motion.sheet,
        easing: motion.easeSheet,
        useNativeDriver: true,
      }).start();
    } else if (mounted) {
      Animated.timing(progress, {
        toValue: 0,
        duration: reduced ? 0 : 220,
        easing: motion.easeOut,
        useNativeDriver: true,
      }).start(({ finished }) => finished && setMounted(false));
    }
  }, [visible, mounted, reduced, progress]);

  if (!mounted) return null;

  const sizing: ViewStyle = heightRatio
    ? { height: screenH * heightRatio }
    : { maxHeight: screenH * (maxHeightRatio ?? 0.92) };

  return (
    <Modal transparent visible statusBarTranslucent navigationBarTranslucent onRequestClose={onClose} animationType="none">
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        onLayout={(e) => setHostH(e.nativeEvent.layout.height)}
      >
        <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, { opacity: progress }]}>
          <Pressable style={styles.fill} onPress={onClose} accessibilityLabel="Close" accessibilityRole="button" />
        </Animated.View>
        <Animated.View
          accessibilityViewIsModal
          accessibilityLabel={accessibilityLabel}
          style={[
            styles.sheet,
            sizing,
            {
              transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [screenH, 0] }) }],
            },
          ]}
        >
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/** The 38×5 grabber at the top of every sheet. */
export function SheetGrabber({ bottom = 6 }: { bottom?: number }) {
  return (
    <View style={[styles.grabberWrap, { paddingBottom: bottom }]}>
      <View style={styles.grabber} />
    </View>
  );
}

/** Round 32px close button. */
export function SheetCloseButton({ onPress, icon }: { onPress: () => void; icon?: ReactNode }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={icon ? 'Back' : 'Close'}
      onPress={onPress}
      hitSlop={6}
      style={styles.close}
    >
      {icon ?? <X size={18} color={colors.textSecondary} strokeWidth={2.2} />}
    </Pressable>
  );
}

/** Title row with a close button and a hairline divider underneath. */
export function SheetHeader({
  title,
  onClose,
  paddingX = 20,
  topPadding = 6,
  divider = true,
  accessory,
}: {
  title: string;
  onClose: () => void;
  paddingX?: number;
  topPadding?: number;
  divider?: boolean;
  /** Shown right after the title, e.g. a status chip. */
  accessory?: ReactNode;
}) {
  return (
    <View
      style={[
        styles.header,
        { paddingHorizontal: paddingX, paddingTop: topPadding },
        divider && styles.headerDivider,
      ]}
    >
      <View style={styles.titleRow}>
        <Text size={type.title3} weight={700} color={colors.textPrimary} accessibilityRole="header">
          {title}
        </Text>
        {accessory}
      </View>
      <SheetCloseButton onPress={onClose} />
    </View>
  );
}

/** Sticky footer with a top divider; pads for the home indicator. */
export function SheetFooter({
  children,
  paddingX = 22,
  divider = true,
  style,
}: {
  children: ReactNode;
  paddingX?: number;
  divider?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        { paddingHorizontal: paddingX, paddingTop: 12, paddingBottom: 16 + insets.bottom },
        divider && styles.footerDivider,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Bottom spacer for sheets without a footer. */
export function SheetBottomInset({ extra = 0 }: { extra?: number }) {
  const insets = useSafeAreaInsets();
  return <View style={{ height: insets.bottom + extra }} />;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrim: { backgroundColor: colors.scrim },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    boxShadow: shadows.sheet,
    overflow: 'hidden',
  },
  grabberWrap: { alignItems: 'center', paddingTop: 10 },
  grabber: { width: 38, height: 5, borderRadius: radius.full, backgroundColor: colors.borderDefault },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1, minWidth: 0 },
  headerDivider: { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  footerDivider: { borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  close: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
