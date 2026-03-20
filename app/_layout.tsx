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
    surfaceVariant: Colors.surfaceLight,
    outline: Colors.border,
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack 
        screenOptions={{ 
          headerStyle: { 
            backgroundColor: Colors.primaryDark,
          }, 
          headerTintColor: Colors.accent,
          headerTitleStyle: {
            color: Colors.text,
            fontWeight: '700',
            fontSize: 16,
            letterSpacing: 0.5,
          },
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="team/[id]" 
          options={{ 
            title: 'TEAM ROSTER', 
            headerBackTitle: 'Back' 
          }} 
        />
        <Stack.Screen 
          name="player/[id]" 
          options={{ 
            title: 'PLAYER PROFILE', 
            headerBackTitle: 'Back' 
          }} 
        />
      </Stack>
    </PaperProvider>
  );
}
