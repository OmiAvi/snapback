import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
        headerStyle: { 
          backgroundColor: Colors.primaryDark,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        },
        headerTintColor: Colors.accent,
        headerTitleStyle: { 
          fontWeight: '700', 
          fontSize: 16,
          letterSpacing: 0.5,
          color: Colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bracket',
          headerTitle: 'SNAPBACK',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="trophy" size={22} color={color} />
              {focused && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.accent, marginTop: 2 }} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Market',
          headerTitle: 'PLAYER MARKET',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="trending-up" size={22} color={color} />
              {focused && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.accent, marginTop: 2 }} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerTitle: 'MY ACCOUNT',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="person" size={22} color={color} />
              {focused && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.accent, marginTop: 2 }} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
