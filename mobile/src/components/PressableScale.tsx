import { useRef, useState, type ReactNode } from 'react';
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { useReducedMotion } from '@/lib/useReducedMotion';
import { motion } from '@/theme/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  /** Scale while pressed; the prototype uses 0.98 for buttons and 0.94–0.96 for icon buttons. */
  pressedScale?: number;
  /** Background shown while pressed (row-style press feedback). */
  pressedBackground?: string;
};

/** Pressable with the design system's press motion: scale down, 160ms ease-out. */
export function PressableScale({
  style,
  pressedScale = 0.98,
  pressedBackground,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);
  const reduced = useReducedMotion();

  const animateTo = (value: number) => {
    if (reduced) {
      scale.setValue(value);
      return;
    }
    Animated.timing(scale, {
      toValue: value,
      duration: motion.fast,
      easing: motion.easeOut,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      {...rest}
      onPressIn={(e) => {
        animateTo(pressedScale);
        if (pressedBackground) setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        animateTo(1);
        if (pressedBackground) setPressed(false);
        onPressOut?.(e);
      }}
      style={[
        style,
        { transform: [{ scale }] },
        pressedBackground && pressed ? { backgroundColor: pressedBackground } : null,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}
