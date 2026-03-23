import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '@/context/app-data-context';
import type { Team } from '@/constants/data';
import { getTeamLogoUri } from '@/constants/team-logos';
import { BorderRadius, Colors, FontSize, Shadows, Spacing } from '@/constants/theme';

type Matchup = {
  topSeed: Team;
  bottomSeed: Team;
};

function TeamBadge({
  team,
  compact = false,
}: {
  team: Team;
  compact?: boolean;
}) {
  const logoUri = getTeamLogoUri(team.id);
  const initials = team.shortName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <View style={[styles.teamBadge, compact && styles.teamBadgeCompact]}>
      <View style={[styles.teamLogoShell, compact && styles.teamLogoShellCompact]}>
        {logoUri ? (
          <Image
            source={{ uri: logoUri }}
            style={[styles.teamLogoImage, compact && styles.teamLogoImageCompact]}
            resizeMode="contain"
          />
        ) : (
          <Text style={[styles.teamLogoFallback, compact && styles.teamLogoFallbackCompact]}>
            {initials}
          </Text>
        )}
      </View>
      <View style={styles.teamMeta}>
        <View style={styles.teamMetaRow}>
          <Text style={styles.seedPill}>{team.seed}</Text>
          <Text style={styles.teamShortName} numberOfLines={1}>
            {team.shortName}
          </Text>
        </View>
        <Text style={styles.teamRecord} numberOfLines={1}>
          {team.record}
        </Text>
      </View>
    </View>
  );
}

function MatchupCard({
  matchup,
  onTeamPress,
}: {
  matchup: Matchup;
  onTeamPress: (team: Team) => void;
}) {
  return (
    <View style={styles.matchupCard}>
      <TouchableOpacity
        activeOpacity={0.82}
        style={styles.teamPressable}
        onPress={() => onTeamPress(matchup.topSeed)}
      >
        <TeamBadge team={matchup.topSeed} />
      </TouchableOpacity>
      <View style={styles.matchupDividerWrap}>
        <View style={styles.matchupDivider} />
        <Text style={styles.matchupLabel}>VS</Text>
        <View style={styles.matchupDivider} />
      </View>
      <TouchableOpacity
        activeOpacity={0.82}
        style={styles.teamPressable}
        onPress={() => onTeamPress(matchup.bottomSeed)}
      >
        <TeamBadge team={matchup.bottomSeed} />
      </TouchableOpacity>
    </View>
  );
}

function RegionSection({
  region,
  matchups,
  onTeamPress,
  cardWidth,
}: {
  region: string;
  matchups: Matchup[];
  onTeamPress: (team: Team) => void;
  cardWidth: number;
}) {
  return (
    <View style={[styles.regionSection, { width: cardWidth }]}>
      <View style={styles.regionHeader}>
        <Text style={styles.regionTitle}>{region}</Text>
        <Text style={styles.regionSubtitle}>{matchups.length} first-round matchups</Text>
      </View>
      <View style={styles.regionBody}>
        {matchups.map((matchup, index) => (
          <MatchupCard
            key={`${region}-${index}-${matchup.topSeed.id}-${matchup.bottomSeed.id}`}
            matchup={matchup}
            onTeamPress={onTeamPress}
          />
        ))}
      </View>
    </View>
  );
}

export default function BracketScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { bracket, isLoading } = useAppData();

  const sections = useMemo(
    () =>
      ['East', 'West', 'South', 'Midwest'].map((region) => ({
        region,
        matchups: bracket.find((entry) => entry.region === region)?.matchups ?? [],
      })),
    [bracket]
  );

  const cardWidth =
    width >= 900
      ? Math.min(360, (width - Spacing.md * 3) / 2)
      : width - Spacing.md * 2;

  const handleTeamPress = (team: Team) => {
    router.push(`/team/${team.id}`);
  };

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Loading bracket...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.headerEyebrow}>2026 Tournament</Text>
          <Text style={styles.headerTitle}>Bracket Board</Text>
          <Text style={styles.headerDescription}>
            View each school's roster, stats, and stock prices by tapping on their logo.
          </Text>
        </View>

        <View style={styles.regionGrid}>
          {sections.map(({ region, matchups }) => (
            <RegionSection
              key={region}
              region={region}
              matchups={matchups}
              onTeamPress={handleTeamPress}
              cardWidth={cardWidth}
            />
          ))}
        </View>

        <View style={styles.hint}>
          <View style={styles.hintIcon}>
            <Ionicons name="flash" size={12} color={Colors.accent} />
          </View>
          <Text style={styles.hintText}>Tap a team logo to view players and trade stocks</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  headerCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    transform: [{ translateY: 12 }],
    ...Shadows.card,
  },
  headerEyebrow: {
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  headerDescription: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 20,
  },
  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'center',
  },
  regionSection: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.card,
  },
  regionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  regionTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  regionSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  regionBody: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  matchupCard: {
    backgroundColor: Colors.cardLight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  teamPressable: {
    borderRadius: BorderRadius.md,
  },
  matchupDividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  matchupDivider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  matchupLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  teamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.xs,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
  },
  teamBadgeCompact: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  teamLogoShell: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamLogoShellCompact: {
    width: 72,
    height: 72,
    borderRadius: 22,
  },
  teamLogoImage: {
    width: 38,
    height: 38,
  },
  teamLogoImageCompact: {
    width: 54,
    height: 54,
  },
  teamLogoFallback: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  teamLogoFallbackCompact: {
    fontSize: FontSize.xl,
  },
  teamMeta: {
    flex: 1,
    gap: 2,
  },
  teamMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  seedPill: {
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.accentLight,
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontWeight: '800',
    overflow: 'hidden',
    textAlign: 'center',
  },
  teamShortName: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  teamRecord: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.round,
    alignSelf: 'center',
    marginTop: Spacing.xs,
  },
  hintIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});
