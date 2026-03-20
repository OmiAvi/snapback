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
  return (
    <View style={styles.matchupCard}>
      <TouchableOpacity
        style={[styles.teamRow, styles.topTeam]}
        onPress={() => matchup.topSeed.players.length > 0 && onTeamPress(matchup.topSeed)}
        activeOpacity={matchup.topSeed.players.length > 0 ? 0.7 : 1}
      >
        <View style={styles.seedBadge}>
          <Text style={styles.seedText}>{matchup.topSeed.seed}</Text>
        </View>
        <Text style={[styles.teamName, matchup.topSeed.players.length === 0 && styles.teamNameDim]} numberOfLines={1}>
          {matchup.topSeed.shortName}
        </Text>
        <View style={styles.recordBadge}>
          <Text style={styles.recordText}>{matchup.topSeed.record}</Text>
        </View>
        {matchup.topSeed.players.length > 0 && (
          <Ionicons name="chevron-forward" size={14} color={Colors.accent} />
        )}
      </TouchableOpacity>

      <View style={styles.divider}>
        <Text style={styles.vsText}>vs</Text>
        <View style={styles.gameInfo}>
          <Text style={styles.gameInfoText}>{matchup.gameDate} · {matchup.gameTime}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.teamRow, styles.bottomTeam]}
        onPress={() => matchup.bottomSeed.players.length > 0 && onTeamPress(matchup.bottomSeed)}
        activeOpacity={matchup.bottomSeed.players.length > 0 ? 0.7 : 1}
      >
        <View style={[styles.seedBadge, styles.seedBadgeLow]}>
          <Text style={styles.seedText}>{matchup.bottomSeed.seed}</Text>
        </View>
        <Text style={[styles.teamName, matchup.bottomSeed.players.length === 0 && styles.teamNameDim]} numberOfLines={1}>
          {matchup.bottomSeed.shortName}
        </Text>
        <View style={styles.recordBadge}>
          <Text style={styles.recordText}>{matchup.bottomSeed.record}</Text>
        </View>
        {matchup.bottomSeed.players.length > 0 && (
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
        <Text style={styles.headerTitle}>2024 NCAA Tournament</Text>
        <Text style={styles.headerSubtitle}>First Round • Tap a team to view players</Text>
      </View>

      <View style={styles.regionTabs}>
        {regions.map(region => (
          <TouchableOpacity
            key={region}
            style={[styles.regionTab, activeRegion === region && styles.regionTabActive]}
            onPress={() => setActiveRegion(region)}
          >
            <Text style={[styles.regionTabText, activeRegion === region && styles.regionTabTextActive]}>
              {region}
            </Text>
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
          <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.hintText}>Teams with ▶ have tradeable player stocks</Text>
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
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  regionTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  regionTab: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  regionTabActive: {
    borderBottomColor: Colors.accent,
  },
  regionTabText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  regionTabTextActive: {
    color: Colors.accent,
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
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
  },
  topTeam: {
    borderBottomWidth: 0,
  },
  bottomTeam: {},
  seedBadge: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedBadgeLow: {
    backgroundColor: Colors.surfaceLight,
    opacity: 0.8,
  },
  seedText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: 'bold',
  },
  teamName: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  teamNameDim: {
    color: Colors.textSecondary,
  },
  recordBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
  },
  recordText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  vsText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: 'bold',
  },
  gameInfo: {
    flex: 1,
  },
  gameInfoText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  hintText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
});
