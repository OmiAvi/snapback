import { Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

export default function TabLayout() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          ...Shadows.sm,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: { 
          backgroundColor: Colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: Colors.text,
        headerTitleStyle: { 
          fontWeight: '700', 
          fontSize: 20,
          color: Colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bracket',
          headerTitle: 'OnIt',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Market',
          headerTitle: 'OnIt',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          title: 'Play',
          headerTitle: 'OnIt',
          tabBarIcon: ({ color }) => (
            <Ionicons name="game-controller-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerTitle: 'OnIt',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
