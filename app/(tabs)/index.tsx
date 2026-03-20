import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BRACKET } from '@/constants/data';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import type { Team, Matchup } from '@/constants/data';

function MatchupCard({ matchup, onTeamPress }: { matchup: Matchup; onTeamPress: (team: Team) => void }) {
  const hasTopPlayers = matchup.topSeed.players.length > 0;
  const hasBottomPlayers = matchup.bottomSeed.players.length > 0;

  return (
    <View style={styles.matchupCard}>
      <View style={styles.matchupGlow} />
      <TouchableOpacity
        style={[styles.teamRow, styles.topTeam]}
        onPress={() => hasTopPlayers && onTeamPress(matchup.topSeed)}
        activeOpacity={hasTopPlayers ? 0.7 : 1}
      >
        <View style={[styles.seedBadge, hasTopPlayers && styles.seedBadgeActive]}>
          <Text style={[styles.seedText, hasTopPlayers && styles.seedTextActive]}>{matchup.topSeed.seed}</Text>
        </View>
        <Text style={[styles.teamName, !hasTopPlayers && styles.teamNameDim]} numberOfLines={1}>
          {matchup.topSeed.shortName}
        </Text>
        <View style={[styles.recordBadge, hasTopPlayers && styles.recordBadgeActive]}>
          <Text style={[styles.recordText, hasTopPlayers && styles.recordTextActive]}>{matchup.topSeed.record}</Text>
        </View>
        {hasTopPlayers && (
          <Ionicons name="chevron-forward" size={14} color={Colors.accent} />
        )}
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <View style={styles.gameInfo}>
          <Text style={styles.gameInfoText}>{matchup.gameDate} | {matchup.gameTime}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.teamRow, styles.bottomTeam]}
        onPress={() => hasBottomPlayers && onTeamPress(matchup.bottomSeed)}
        activeOpacity={hasBottomPlayers ? 0.7 : 1}
      >
        <View style={[styles.seedBadge, hasBottomPlayers && styles.seedBadgeActive]}>
          <Text style={[styles.seedText, hasBottomPlayers && styles.seedTextActive]}>{matchup.bottomSeed.seed}</Text>
        </View>
        <Text style={[styles.teamName, !hasBottomPlayers && styles.teamNameDim]} numberOfLines={1}>
          {matchup.bottomSeed.shortName}
        </Text>
        <View style={[styles.recordBadge, hasBottomPlayers && styles.recordBadgeActive]}>
          <Text style={[styles.recordText, hasBottomPlayers && styles.recordTextActive]}>{matchup.bottomSeed.record}</Text>
        </View>
        {hasBottomPlayers && (
          <Ionicons name="chevron-forward" size={14} color={Colors.accent} />
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function BracketScreen() {
  const router = useRouter();
  const [activeRegion, setActiveRegion] = useState('East');

  const regions = ['East', 'West', 'South', 'Midwest'];

  const handleTeamPress = (team: Team) => {
    router.push(`/team/${team.id}`);
  };

  const activeData = BRACKET.find(b => b.region === activeRegion);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>2024 TOURNAMENT</Text>
          <Text style={styles.headerSubtitle}>First Round | Tap team to view players</Text>
        </View>
      </View>

      <View style={styles.regionTabs}>
        {regions.map((region, index) => (
          <TouchableOpacity
            key={region}
            style={[styles.regionTab, activeRegion === region && styles.regionTabActive]}
            onPress={() => setActiveRegion(region)}
          >
            <Text style={[styles.regionTabText, activeRegion === region && styles.regionTabTextActive]}>
              {region.toUpperCase()}
            </Text>
            {activeRegion === region && <View style={styles.regionTabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeData?.matchups.map((matchup) => (
          <MatchupCard
            key={matchup.id}
            matchup={matchup}
            onTeamPress={handleTeamPress}
          />
        ))}

        <View style={styles.hint}>
          <View style={styles.hintIcon}>
            <Ionicons name="flash" size={12} color={Colors.accent} />
          </View>
          <Text style={styles.hintText}>Teams with arrows have tradeable stocks</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.accent,
  },
  headerContent: {
    gap: 2,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    letterSpacing: 0.5,
  },
  regionTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  regionTab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    position: 'relative',
  },
  regionTabActive: {},
  regionTabText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '600',
    letterSpacing: 1,
  },
  regionTabTextActive: {
    color: Colors.accent,
  },
  regionTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: Colors.accent,
    borderRadius: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  matchupCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  matchupGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.accent,
    opacity: 0.3,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    gap: Spacing.sm,
  },
  topTeam: {
    borderBottomWidth: 0,
  },
  bottomTeam: {},
  seedBadge: {
    width: 26,
    height: 26,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  seedBadgeActive: {
    backgroundColor: Colors.accentDim,
    borderColor: Colors.borderLight,
  },
  seedText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  seedTextActive: {
    color: Colors.accent,
  },
  teamName: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  teamNameDim: {
    color: Colors.textMuted,
  },
  recordBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recordBadgeActive: {
    borderColor: Colors.borderLight,
  },
  recordText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  recordTextActive: {
    color: Colors.textSecondary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  vsContainer: {
    backgroundColor: Colors.accentDim,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  vsText: {
    color: Colors.accent,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  gameInfo: {
    flex: 1,
  },
  gameInfoText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    letterSpacing: 0.3,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hintIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    letterSpacing: 0.3,
  },
});
