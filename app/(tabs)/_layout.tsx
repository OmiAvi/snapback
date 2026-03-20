import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { Colors, Shadows } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.border,
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          ...Shadows.soft,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: { 
          backgroundColor: Colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: { 
          fontWeight: '700', 
          fontSize: 18,
          color: Colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bracket',
          headerTitle: 'Snapback',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={24} color={color} />
              {focused && <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.accent, marginTop: 4 }} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Market',
          headerTitle: 'Player Market',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={24} color={color} />
              {focused && <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.accent, marginTop: 4 }} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerTitle: 'My Account',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
              {focused && <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.accent, marginTop: 4 }} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
