import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="main" />
      <Stack.Screen name="folder/[id]" />
      <Stack.Screen name="note/[id]" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="archive" />
      <Stack.Screen name="trash" />
      <Stack.Screen name="reminder" />
    </Stack>
  );
}