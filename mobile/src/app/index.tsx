import { Redirect } from 'expo-router';

import { useAppStore } from '@/state/store';

export default function Index() {
  const signedIn = useAppStore((s) => s.role !== null);
  return <Redirect href={signedIn ? '/home' : '/login'} />;
}
