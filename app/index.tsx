import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

export default function IndexScreen() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return <Redirect href={user ? '/(tabs)/marketplace' : '/login'} />;
}
