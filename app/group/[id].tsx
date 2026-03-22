import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Colors, FontSize, Shadows, Spacing } from '@/constants/theme';
import { usePlay } from '@/context/play-context';
import { useAppData } from '@/context/app-data-context';
import { getPlayerImageUri } from '@/utils/player-images';
import { getRosterScore } from '@/utils/play';

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getGroupById } = usePlay();
  const { allPlayers } = useAppData();

  const group = id ? getGroupById(id) : undefined;
  const playerById = useMemo(
    () => new Map(allPlayers.map((player) => [player.id, player])),
    [allPlayers]
  );

  const leaderboard = useMemo(() => {
    if (!group?.rosterEntries) {
      return [];
    }

    return Object.values(group.rosterEntries)
      .map((entry) => ({
        ...entry,
        score: getRosterScore(entry.playerIds, allPlayers),
      }))
      .sort((a, b) => b.score - a.score);
  }, [allPlayers, group?.rosterEntries]);

  if (!group) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyTitle}>Group not found</Text>
        <Text style={styles.emptyText}>This group is not in your Play list yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>{group.name}</Text>
        <Text style={styles.heroCode}>Invite code: {group.code}</Text>
        <View style={styles.heroMetaRow}>
          <View style={styles.heroMetaChip}>
            <Ionicons name="people-outline" size={14} color={Colors.accent} />
            <Text style={styles.heroMetaText}>{group.memberIds.length} members</Text>
          </View>
          <View style={styles.heroMetaChip}>
            <Ionicons name="trophy-outline" size={14} color={Colors.accent} />
            <Text style={styles.heroMetaText}>{leaderboard.length} live rosters</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Leaderboard</Text>
        <Text style={styles.sectionCaption}>Live score = total stock change %</Text>
      </View>

      {leaderboard.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No roster submissions yet</Text>
          <Text style={styles.emptyText}>Link a drafted roster from the Play tab to get this pool moving.</Text>
        </View>
      ) : (
        leaderboard.map((entry, index) => (
          <View key={entry.userId} style={styles.leaderCard}>
            <View style={styles.leaderHeader}>
              <View>
                <Text style={styles.rankText}>#{index + 1}</Text>
                <Text style={styles.rosterName}>{entry.rosterName}</Text>
                <Text style={styles.rosterMeta}>Budget ${entry.budgetUsed.toFixed(1)}</Text>
              </View>
              <Text style={[styles.scoreText, entry.score >= 0 ? styles.scorePositive : styles.scoreNegative]}>
                {entry.score >= 0 ? '+' : ''}
                {entry.score.toFixed(1)}
              </Text>
            </View>

            <View style={styles.playerList}>
              {entry.playerIds.map((playerId) => {
                const player = playerById.get(playerId);
                if (!player) {
                  return null;
                }

                return (
                  <View key={player.id} style={styles.playerRow}>
                    <Image source={{ uri: getPlayerImageUri(player) }} style={styles.playerImage} resizeMode="cover" />
                    <View style={styles.playerInfo}>
                      <Text style={styles.playerName}>{player.name}</Text>
                      <Text style={styles.playerMeta}>
                        {player.team} · {player.priceChangePercent >= 0 ? '+' : ''}
                        {player.priceChangePercent.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  heroCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  heroTitle: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  heroCode: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  heroMetaRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  heroMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.round,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  heroMetaText: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '800',
    marginBottom: 2,
  },
  sectionCaption: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 20,
  },
  leaderCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  leaderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  rankText: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '800',
    marginBottom: 4,
  },
  rosterName: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '800',
    marginBottom: 2,
  },
  rosterMeta: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  scoreText: {
    fontSize: FontSize.xxl,
    fontWeight: '900',
  },
  scorePositive: {
    color: Colors.green,
  },
  scoreNegative: {
    color: Colors.red,
  },
  playerList: {
    gap: Spacing.sm,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  playerImage: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceLight,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
    marginBottom: 2,
  },
  playerMeta: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
});
