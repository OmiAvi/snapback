import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { Colors } from '@/constants/theme';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.accent,
    background: Colors.background,
    surface: Colors.surface,
    onSurface: Colors.text,
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerStyle: { backgroundColor: Colors.primaryDark }, headerTintColor: Colors.text }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="team/[id]" options={{ title: 'Team Roster', headerBackTitle: 'Bracket' }} />
        <Stack.Screen name="player/[id]" options={{ title: 'Player Profile', headerBackTitle: 'Back' }} />
      </Stack>
    </PaperProvider>
  );
}
