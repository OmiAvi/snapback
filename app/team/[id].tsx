import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Player } from '@/constants/data';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';
import { useAppData } from '@/context/app-data-context';
import { getTeamLogoUri } from '@/constants/team-logos';
import { getPlayerImageUri } from '@/utils/player-images';

function PlayerCard({ player, onPress }: { player: Player; onPress: () => void }) {
  const isPositive = player.priceChange >= 0;
  const playerImageUri = getPlayerImageUri(player);
  return (
    <TouchableOpacity style={styles.playerCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.playerCardGlow} />
      <View style={[styles.playerHeadshotWrap, player.isHot && styles.playerHeadshotWrapHot]}>
        <Image source={{ uri: playerImageUri }} style={styles.playerHeadshot} resizeMode="cover" />
      </View>

      <View style={styles.playerInfo}>
        <View style={styles.playerNameRow}>
          <Text style={styles.playerName}>{player.name}</Text>
          {player.isHot && (
            <View style={styles.hotBadge}>
              <Text style={styles.hotText}>HOT</Text>
            </View>
          )}
        </View>
        <View style={styles.playerMeta}>
          <View style={styles.metaBadge}>
            <Text style={styles.metaText}>{player.position}</Text>
          </View>
          <Text style={styles.metaExtra}>{player.year} | {player.height}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statChip}>{player.stats.ppg} PPG</Text>
          <Text style={styles.statChip}>{player.stats.rpg} RPG</Text>
          <Text style={styles.statChip}>{player.stats.apg} APG</Text>
        </View>
      </View>

      <View style={styles.priceBlock}>
        <Text style={styles.stockPrice}>${player.stockPrice.toFixed(2)}</Text>
        <View style={[styles.changeBadge, isPositive ? styles.changeBadgeGreen : styles.changeBadgeRed]}>
          <Ionicons
            name={isPositive ? 'caret-up' : 'caret-down'}
            size={10}
            color={isPositive ? Colors.green : Colors.red}
          />
          <Text style={[styles.changeText, isPositive ? styles.changeGreen : styles.changeRed]}>
            {isPositive ? '+' : ''}{player.priceChangePercent.toFixed(1)}%
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} style={{ marginTop: 4 }} />
      </View>
    </TouchableOpacity>
  );
}

export default function TeamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { teams } = useAppData();

  const team = teams[id as string];

  if (!team) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.red} />
        <Text style={styles.errorText}>Team not found</Text>
      </View>
    );
  }

  const sortedPlayers = [...team.players].sort((a, b) => b.stockPrice - a.stockPrice);
  const avgPrice = team.players.length
    ? team.players.reduce((s, p) => s + p.stockPrice, 0) / team.players.length
    : 0;
  const hotCount = team.players.filter(p => p.isHot).length;
  const teamLogoUri = getTeamLogoUri(team.id);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <Stack.Screen options={{ title: team.name }} />

      <View style={styles.teamHeader}>
        <View style={styles.teamHeaderLeft}>
          <View style={styles.teamLogoWrap}>
            {teamLogoUri ? (
              <Image source={{ uri: teamLogoUri }} style={styles.teamLogo} resizeMode="contain" />
            ) : (
              <View style={styles.seedBadge}>
                <Text style={styles.seedText}>#{team.seed}</Text>
              </View>
            )}
          </View>
          <View>
            <Text style={styles.teamName}>{team.name}</Text>
            <Text style={styles.teamMeta}>{team.region} Region · {team.conference}</Text>
            <Text style={styles.teamSubMeta}>Seed #{team.seed} · {team.shortName}</Text>
          </View>
        </View>
        <View style={styles.teamRecord}>
          <Text style={styles.recordValue}>{team.record}</Text>
          <Text style={styles.recordLabel}>Record</Text>
        </View>
      </View>

      <View style={styles.teamStats}>
        <View style={styles.teamStatItem}>
          <Text style={styles.teamStatValue}>{team.players.length}</Text>
          <Text style={styles.teamStatLabel}>Players</Text>
        </View>
        <View style={styles.teamStatDivider} />
        <View style={styles.teamStatItem}>
          <Text style={[styles.teamStatValue, { color: Colors.accent }]}>
            {team.players.length ? `$${avgPrice.toFixed(2)}` : '--'}
          </Text>
          <Text style={styles.teamStatLabel}>Avg Price</Text>
        </View>
        <View style={styles.teamStatDivider} />
        <View style={styles.teamStatItem}>
          <Text style={[styles.teamStatValue, { color: '#ff7f00' }]}>{hotCount}</Text>
          <Text style={styles.teamStatLabel}>Hot 🔥</Text>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>PLAYER STOCKS</Text>
        <Text style={styles.listHeaderSub}>
          {team.players.length ? 'Tap to buy/sell' : 'School profile and roster'}
        </Text>
      </View>

      {team.players.length ? (
        <FlatList
          data={sortedPlayers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PlayerCard
              player={item}
              onPress={() => router.push(`/player/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyRosterCard}>
          <Ionicons name="school-outline" size={28} color={Colors.accent} />
          <Text style={styles.emptyRosterTitle}>School profile loaded</Text>
          <Text style={styles.emptyRosterText}>
            Team info is available here, but the player list for this school has not been added yet.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  errorText: {
    color: Colors.text,
    fontSize: FontSize.lg,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  teamHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    flex: 1,
  },
  teamLogoWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  teamLogo: {
    width: 40,
    height: 40,
  },
  seedBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  seedText: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  teamName: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  teamMeta: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  teamSubMeta: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  teamRecord: {
    alignItems: 'center',
  },
  recordValue: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  recordLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  teamStats: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  teamStatItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  teamStatValue: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  teamStatLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  teamStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  listHeaderText: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  listHeaderSub: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  emptyRosterCard: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.card,
  },
  emptyRosterTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  emptyRosterText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 20,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  playerCardGlow: {
    display: 'none',
  },
  playerHeadshotWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playerHeadshotWrapHot: {
    borderColor: Colors.green,
    borderWidth: 2,
  },
  playerHeadshot: {
    width: '100%',
    height: '100%',
  },
  playerInfo: {
    flex: 1,
    gap: 3,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  playerName: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  hotBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.greenLight,
  },
  hotText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.green,
  },
  playerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  metaText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  metaExtra: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statChip: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    backgroundColor: Colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  stockPrice: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: 3,
  },
  changeBadgeGreen: {
    backgroundColor: Colors.greenLight,
  },
  changeBadgeRed: {
    backgroundColor: Colors.redLight,
  },
  changeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  changeGreen: {
    color: Colors.green,
  },
  changeRed: {
    color: Colors.red,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.xs,
  },
});
