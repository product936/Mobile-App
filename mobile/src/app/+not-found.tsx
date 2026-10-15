import { Redirect } from 'expo-router';

/** Unknown addresses (old links, embedded previews) go to the app's start screen. */
export default function NotFound() {
  return <Redirect href="/" />;
}
