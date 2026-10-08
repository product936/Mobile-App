import { StyleSheet, View } from 'react-native';
import { UserPlus } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { BackHeader } from '@/components/chrome';
import { Avatar, Card, Pill, layout } from '@/components/primitives';
import { Screen, ScrollBody } from '@/components/Screen';
import { StickyFooterButton } from '@/components/StickyFooterButton';
import { Text } from '@/components/Text';
import { TEAMMATES, type TeamMember } from '@/data/content';
import { useRoleConfig } from '@/state/store';
import { colors, shadows, type } from '@/theme/tokens';

export default function TeamScreen() {
  const { user } = useRoleConfig();
  const members: (TeamMember & { you?: boolean })[] = [
    { initials: user.initials, name: user.name, email: user.email, role: 'Owner', fg: colors.primaryDeep, bg: colors.indigo50, you: true },
    ...TEAMMATES,
  ];

  return (
    <Screen>
      <BackHeader title="Team & roles" />
      <ScrollBody contentStyle={{ paddingTop: 16, paddingBottom: 90 }}>
        <Text size={type.footnote} color={colors.textTertiary} style={{ marginBottom: 10 }}>
          {members.length} people have access to this location
        </Text>
        <Card style={{ overflow: 'hidden' }}>
          {members.map((m, i) => (
            <View key={m.email} style={[styles.row, i < members.length - 1 && styles.divider]}>
              <Avatar initials={m.initials} size={42} fontSize={14} background={m.bg} color={m.fg} />
              <View style={layout.flex1}>
                <Text size={type.callout} weight={700} color={colors.textPrimary}>
                  {m.name}
                  {m.you ? (
                    <Text size={type.footnote} weight={600} color={colors.textTertiary}>
                      {' '}
                      · You
                    </Text>
                  ) : null}
                </Text>
                <Text size={type.footnote} color={colors.textTertiary}>
                  {m.email}
                </Text>
              </View>
              <Pill
                label={m.role}
                background={m.role === 'Owner' ? colors.blue50 : colors.surfaceBase}
                color={m.role === 'Owner' ? colors.primaryAccent : colors.textSecondary}
                style={{ alignSelf: 'center' }}
              />
            </View>
          ))}
        </Card>
      </ScrollBody>
      <StickyFooterButton>
        <Button label="Invite teammate" style={{ boxShadow: shadows.stickyButton }} iconLeft={<UserPlus size={18} color={colors.white} strokeWidth={2.2} />} />
      </StickyFooterButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
});
