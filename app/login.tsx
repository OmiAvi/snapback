import React, { useState } from 'react';
import type { FirebaseError } from 'firebase/app';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

const ONIT_LOGO = require('@/assets/onit-logo.png');

export default function LoginScreen() {
  const { user, isAuthLoading, signInAsGuest } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthLoading && user) {
    return <Redirect href="/(tabs)" />;
  }

  const handleGuestSignIn = async () => {
    try {
      setIsSubmitting(true);
      await signInAsGuest();
    } catch (error) {
      const firebaseError = error as FirebaseError;
      const details = firebaseError?.code
        ? `${firebaseError.code}\n${firebaseError.message}`
        : 'We could not sign you in right now. Please try again.';

      Alert.alert('Sign-in failed', details);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComingSoon = (label: string) => {
    Alert.alert(label, `${label} is coming soon. For now, use Continue as Guest.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.glowTop} />
      <View style={styles.content}>
        <View style={styles.logoBlock}>
          <View style={styles.logoFrame}>
            <Image source={ONIT_LOGO} style={styles.logoImage} resizeMode="contain" />
          </View>
          <Text style={styles.tagline}>Trade the tournament. Track every move.</Text>
        </View>

        <View style={styles.optionsCard}>
          <Text style={styles.optionsTitle}>Sign In</Text>
          <Text style={styles.optionsSubtitle}>Choose how you want to enter the market.</Text>

          <TouchableOpacity
            style={styles.primaryOption}
            onPress={handleGuestSignIn}
            activeOpacity={0.85}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Ionicons name="flash" size={18} color={Colors.white} />
                <Text style={styles.primaryOptionText}>Continue as Guest</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryOption}
            onPress={() => handleComingSoon('Sign in with Google')}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-google" size={18} color={Colors.text} />
            <Text style={styles.secondaryOptionText}>Sign in with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryOption}
            onPress={() => handleComingSoon('Sign in with Apple')}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-apple" size={18} color={Colors.text} />
            <Text style={styles.secondaryOptionText}>Sign in with Apple</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  glowTop: {
    position: 'absolute',
    top: -140,
    left: -30,
    right: -30,
    height: 320,
    backgroundColor: Colors.accentDim,
    borderRadius: 999,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xxl,
  },
  logoBlock: {
    alignItems: 'center',
    gap: Spacing.md,
    transform: [{ translateY: 50 }],
  },
  logoFrame: {
    width: 340,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 340,
    height: 130,
    transform: [{ scale: 2.8 }],
  },
  tagline: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 22,
    transform: [{ translateY: 20 }],
  },
  optionsCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    transform: [{ translateY: 50 }],
    ...Shadows.card,
  },
  optionsTitle: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  optionsSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    lineHeight: 20,
    marginTop: -4,
  },
  primaryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.text,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.md,
    minHeight: 52,
  },
  primaryOptionText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  secondaryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryOptionText: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
