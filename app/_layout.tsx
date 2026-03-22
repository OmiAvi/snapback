import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Colors } from '@/constants/theme';
import { TradingProvider } from '@/context/trading-context';
import { AuthProvider } from '@/context/auth-context';
import { AppDataProvider } from '@/context/app-data-context';
import { PlayProvider } from '@/context/play-context';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.accent,
    background: Colors.background,
    surface: Colors.surface,
    onSurface: Colors.text,
    surfaceVariant: Colors.surfaceLight,
    outline: Colors.border,
  },
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <TradingProvider>
          <PlayProvider>
            <PaperProvider theme={theme}>
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: Colors.background,
                  },
                  headerTintColor: Colors.text,
                  headerTitleStyle: {
                    color: Colors.text,
                    fontWeight: '700',
                    fontSize: 18,
                  },
                  headerShadowVisible: false,
                  contentStyle: {
                    backgroundColor: Colors.background,
                  },
                }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="team/[id]"
                  options={{
                    title: 'Team Roster',
                    headerBackTitle: 'Back',
                  }}
                />
                <Stack.Screen
                  name="player/[id]"
                  options={{
                    title: 'Player Profile',
                    headerBackTitle: 'Back',
                  }}
                />
                <Stack.Screen
                  name="group/[id]"
                  options={{
                    title: 'Group',
                    headerBackTitle: 'Back',
                  }}
                />
              </Stack>
            </PaperProvider>
          </PlayProvider>
        </TradingProvider>
      </AppDataProvider>
    </AuthProvider>
  );
}
