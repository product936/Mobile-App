import type { ReactNode } from 'react';
import { Linking, Pressable, Share, StyleSheet, View } from 'react-native';
import { router, type Href } from 'expo-router';
import {
  Building,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Download,
  Globe,
  Image as ImageIcon,
  LogOut,
  MapPin,
  Megaphone,
  Share2,
  Users,
  type LucideIcon,
} from 'lucide-react-native';

import { Button } from '@/components/Button';
import { BackButton } from '@/components/chrome';
import { QrPlaceholder } from '@/components/glyphs';
import { PressableScale } from '@/components/PressableScale';
import { Avatar, Card, IconTile, SectionLabel, layout } from '@/components/primitives';
import { Screen, ScrollBody, Spacer } from '@/components/Screen';
import { Text } from '@/components/Text';
import { STORE } from '@/config/roles';
import { useAppStore, useRoleConfig } from '@/state/store';
import { colors, radius, sizes, type } from '@/theme/tokens';

export default function ProfileScreen() {
  const { user } = useRoleConfig();
  const openSheet = useAppStore((s) => s.openSheet);
  const signOut = useAppStore((s) => s.signOut);

  return (
    <Screen>
      <ScrollBody contentStyle={{ paddingBottom: 28 }}>
        <View style={[layout.row, { gap: 6, height: sizes.navbar }]}>
          <BackButton offset={-8} onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))} />
          <Text size={type.title3} weight={700} color={colors.textPrimary} accessibilityRole="header">
            Profile
          </Text>
        </View>

        <Spacer h={6} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Location: ${STORE.locationName}. Change location`}
          onPress={() => openSheet('location')}
          style={styles.locationSelect}
        >
          <MapPin size={18} color={colors.primaryAccent} strokeWidth={2} />
          <Text size={type.callout} weight={600} color={colors.textPrimary} numberOfLines={1} style={layout.flex1}>
            {STORE.locationName}
          </Text>
          <ChevronDown size={16} color={colors.textTertiary} strokeWidth={2.2} />
        </Pressable>

        <Spacer h={18} />
        <View style={{ alignItems: 'center' }}>
          <Avatar initials={user.initials} size={76} fontSize={28} />
          <Spacer h={12} />
          <Text size={type.title2} weight={700} color={colors.textPrimary}>
            {user.name}
          </Text>
          <Text size={type.body} color={colors.textTertiary} style={{ marginTop: 2 }}>
            {user.phone}
          </Text>
        </View>

        <Spacer h={20} />
        <Card style={{ padding: 18 }}>
          <Text size={type.headline} weight={700} color={colors.textPrimary} align="center">
            Collect a Google review
          </Text>
          <Text size={type.footnote} color={colors.textTertiary} align="center" style={{ marginTop: 2 }}>
            Customers scan to rate this location.
          </Text>
          <Spacer h={14} />
          <View style={{ alignItems: 'center' }}>
            <View style={styles.qrFrame}>
              <QrPlaceholder size={150} />
            </View>
          </View>
          <View style={[layout.row, { gap: 10, marginTop: 16 }]}>
            <Button
              label="Share"
              variant="outline"
              height={42}
              fontSize={type.subhead}
              style={layout.flex1}
              iconLeft={<Share2 size={16} color={colors.textSecondary} strokeWidth={2} />}
              onPress={() => Share.share({ message: `Rate ${STORE.locationName} on Google: ${STORE.reviewLink}` })}
            />
            <Button
              label="Download"
              height={42}
              fontSize={type.subhead}
              style={layout.flex1}
              iconLeft={<Download size={16} color={colors.white} strokeWidth={2} />}
            />
          </View>
        </Card>

        <Spacer h={22} />
        <SectionLabel style={{ marginBottom: 10 }}>Manage</SectionLabel>
        <Card style={styles.list}>
          <NavRow Icon={Building} label="Business profile" href="/business-profile" />
          <NavRow Icon={ImageIcon} label="Manage media" href="/media" />
          <NavRow Icon={Megaphone} label="Posts & offers" href="/posts" />
          <NavRow Icon={Users} label="Team & roles" href="/team" last />
        </Card>

        <Spacer h={22} />
        <SectionLabel style={{ marginBottom: 10 }}>Connected pages</SectionLabel>
        <Card style={styles.list}>
          <LinkRow Icon={Globe} title="Google Business Profile" url={STORE.website} />
          <LinkRow Icon={MapPin} title="Location page" url={STORE.locationPage} last />
        </Card>

        <Spacer h={22} />
        <Card style={styles.list}>
          <Row onPress={() => openSheet('support')} label="Support">
            <IconTile size={34}>
              <CircleHelp size={17} color={colors.primaryAccent} strokeWidth={2} />
            </IconTile>
            <Text size={type.callout} weight={600} color={colors.textPrimary} style={layout.flex1}>
              Support
            </Text>
            <ChevronRight size={18} color={colors.textTertiary} strokeWidth={2.2} />
          </Row>
          <Row
            last
            label="Log out"
            onPress={() => {
              signOut();
              router.replace('/login');
            }}
          >
            <IconTile size={34} background={colors.errorBg}>
              <LogOut size={17} color={colors.error} strokeWidth={2} />
            </IconTile>
            <Text size={type.callout} weight={700} color={colors.error} style={layout.flex1}>
              Log out
            </Text>
          </Row>
        </Card>
      </ScrollBody>
    </Screen>
  );
}

function Row({ children, onPress, label, last }: { children: ReactNode; onPress?: () => void; label: string; last?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, !last && styles.rowDivider, pressed && { backgroundColor: colors.surfaceAlt }]}
    >
      {children}
    </Pressable>
  );
}

function NavRow({ Icon, label, href, last }: { Icon: LucideIcon; label: string; href: Href; last?: boolean }) {
  return (
    <Row label={label} onPress={() => router.push(href)} last={last}>
      <IconTile size={34}>
        <Icon size={17} color={colors.primaryAccent} strokeWidth={2} />
      </IconTile>
      <Text size={type.callout} weight={600} color={colors.textPrimary} style={layout.flex1}>
        {label}
      </Text>
      <ChevronRight size={18} color={colors.textTertiary} strokeWidth={2.2} />
    </Row>
  );
}

function LinkRow({ Icon, title, url, last }: { Icon: LucideIcon; title: string; url: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <IconTile size={34}>
        <Icon size={17} color={colors.primaryAccent} strokeWidth={2} />
      </IconTile>
      <View style={layout.flex1}>
        <Text size={type.callout} weight={600} color={colors.textPrimary}>
          {title}
        </Text>
        <Text size={type.footnote} color={colors.primaryAccent} numberOfLines={1}>
          {url}
        </Text>
      </View>
      <PressableScale
        pressedScale={0.96}
        accessibilityRole="link"
        accessibilityLabel={`Visit ${title}`}
        onPress={() => Linking.openURL(`https://${url}`)}
        style={styles.visit}
      >
        <Text size={type.footnote} weight={700} color={colors.primaryAccent} lineHeight={1.2}>
          Visit
        </Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  locationSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.input,
  },
  qrFrame: {
    padding: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.md,
  },
  list: { overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  visit: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: colors.blue50,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
