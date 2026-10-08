import { Pressable, StyleSheet } from 'react-native';

import { Text } from '@/components/Text';
import { colors, sizes, type } from '@/theme/tokens';

/** "Need help? Contact support" link with a 44px hit area. */
export function SupportLink({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} style={styles.link}>
      <Text size={type.subhead} weight={500} color={colors.primaryAccent}>
        Need help? Contact support
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: { alignSelf: 'center', minHeight: sizes.touchMin, paddingHorizontal: 8, justifyContent: 'center' },
});
