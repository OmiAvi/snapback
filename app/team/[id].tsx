import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TEAMS } from '@/constants/data';
import type { Player } from '@/constants/data';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';

function PlayerCard({ player, onPress }: { player: Player; onPress: () => void }) {
  const isPositive = player.priceChange >= 0;
  return (
    <TouchableOpacity style={styles.playerCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.playerCardGlow} />
      <View style={[styles.jerseyBadge, player.isHot && styles.jerseyBadgeHot]}>
        <Text style={[styles.jerseyText, player.isHot && styles.jerseyTextHot]}>#{player.jersey}</Text>
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

  const team = TEAMS[id as string];

  if (!team) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.red} />
        <Text style={styles.errorText}>Team not found</Text>
      </View>
    );
  }

  const sortedPlayers = [...team.players].sort((a, b) => b.stockPrice - a.stockPrice);
  const avgPrice = team.players.reduce((s, p) => s + p.stockPrice, 0) / team.players.length;
  const hotCount = team.players.filter(p => p.isHot).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <Stack.Screen options={{ title: team.name }} />

      <View style={styles.teamHeader}>
        <View style={styles.teamHeaderLeft}>
          <View style={styles.seedBadge}>
            <Text style={styles.seedText}>#{team.seed}</Text>
          </View>
          <View>
            <Text style={styles.teamName}>{team.name}</Text>
            <Text style={styles.teamMeta}>{team.region} Region · {team.conference}</Text>
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
          <Text style={[styles.teamStatValue, { color: Colors.accent }]}>${avgPrice.toFixed(2)}</Text>
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
        <Text style={styles.listHeaderSub}>Tap to buy/sell</Text>
      </View>

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
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
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
  jerseyBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jerseyBadgeHot: {
    backgroundColor: Colors.greenLight,
  },
  jerseyText: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  jerseyTextHot: {
    color: Colors.green,
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
