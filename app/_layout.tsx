import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Colors } from '@/constants/theme';

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
    <PaperProvider theme={theme}>
      <Stack 
        screenOptions={{ 
          headerStyle: { 
            backgroundColor: Colors.surface,
            elevation: 0,
            shadowOpacity: 0,
          }, 
          headerTintColor: Colors.accent,
          headerTitleStyle: {
            color: Colors.text,
            fontWeight: '700',
            fontSize: 18,
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
            title: 'Team Roster', 
            headerBackTitle: 'Back' 
          }} 
        />
        <Stack.Screen 
          name="player/[id]" 
          options={{ 
            title: 'Player Profile', 
            headerBackTitle: 'Back' 
          }} 
        />
      </Stack>
    </PaperProvider>
  );
}
