import { Tabs } from 'expo-router';

import { TabBar } from '@/components/TabBar';
import { useRoleConfig } from '@/state/store';
import { colors } from '@/theme/tokens';

export default function TabsLayout() {
  const { tabs } = useRoleConfig();
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.surfaceBase }, animation: 'fade' }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="leads" />
      <Tabs.Screen name="reviews" />
      {/* Store managers run a single location, so the leaderboard is regional-only. */}
      <Tabs.Screen name="leaderboard" options={{ href: tabs.includes('leaderboard') ? undefined : null }} />
    </Tabs>
  );
}
