import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ALL_PLAYERS } from '@/constants/data';
import type { Player } from '@/constants/data';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

function PriceTag({ price, change, changePercent }: { price: number; change: number; changePercent: number }) {
  const isPositive = change >= 0;
  return (
    <View style={styles.priceContainer}>
      <Text style={styles.price}>${price.toFixed(2)}</Text>
      <View style={[styles.changeBadge, isPositive ? styles.changeBadgeGreen : styles.changeBadgeRed]}>
        <Ionicons
          name={isPositive ? 'caret-up' : 'caret-down'}
          size={10}
          color={isPositive ? Colors.green : Colors.red}
        />
        <Text style={[styles.changeText, isPositive ? styles.changeTextGreen : styles.changeTextRed]}>
          {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
}

function PlayerRow({ player, onPress }: { player: Player; onPress: () => void }) {
  const isPositive = player.priceChange >= 0;
  return (
    <TouchableOpacity style={styles.playerRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.avatarCircle, player.isHot && styles.avatarCircleHot]}>
        <Text style={styles.avatarText}>{player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</Text>
      </View>
      <View style={styles.playerInfo}>
        <View style={styles.playerNameRow}>
          <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
          {player.isHot && <View style={styles.hotBadge}><Text style={styles.hotText}>HOT</Text></View>}
        </View>
        <Text style={styles.playerMeta}>{player.team} | {player.position} | #{player.jersey}</Text>
      </View>
      <PriceTag price={player.stockPrice} change={player.priceChange} changePercent={player.priceChangePercent} />
    </TouchableOpacity>
  );
}

function HotPlayerCard({ player, onPress }: { player: Player; onPress: () => void }) {
  const isPositive = player.priceChange >= 0;
  return (
    <TouchableOpacity style={styles.hotCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.hotCardGlow} />
      <View style={styles.hotAvatarCircle}>
        <Text style={styles.hotAvatarText}>{player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</Text>
      </View>
      <Text style={styles.hotPlayerName} numberOfLines={1}>{player.name}</Text>
      <Text style={styles.hotTeamName}>{player.team}</Text>
      <Text style={styles.hotPrice}>${player.stockPrice.toFixed(2)}</Text>
      <View style={[styles.hotChangeBadge, isPositive ? styles.changeBadgeGreen : styles.changeBadgeRed]}>
        <Ionicons
          name={isPositive ? 'caret-up' : 'caret-down'}
          size={10}
          color={isPositive ? Colors.green : Colors.red}
        />
        <Text style={[styles.hotChangeText, isPositive ? styles.changeTextGreen : styles.changeTextRed]}>
          {isPositive ? '+' : ''}{player.priceChangePercent.toFixed(1)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MarketplaceScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'hot' | 'gainers' | 'losers'>('all');

  const hotPlayers = useMemo(
    () => ALL_PLAYERS.filter(p => p.isHot).slice(0, 6),
    []
  );

  const filteredPlayers = useMemo(() => {
    let players = [...ALL_PLAYERS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      players = players.filter(
        p => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q)
      );
    }

    switch (activeFilter) {
      case 'hot':
        players = players.filter(p => p.isHot);
        break;
      case 'gainers':
        players = players.filter(p => p.priceChange > 0).sort((a, b) => b.priceChangePercent - a.priceChangePercent);
        break;
      case 'losers':
        players = players.filter(p => p.priceChange < 0).sort((a, b) => a.priceChangePercent - b.priceChangePercent);
        break;
      default:
        players.sort((a, b) => b.stockPrice - a.stockPrice);
    }

    return players;
  }, [searchQuery, activeFilter]);

  const handlePlayerPress = (player: Player) => {
    router.push(`/player/${player.id}`);
  };

  const filters: { key: 'all' | 'hot' | 'gainers' | 'losers'; label: string }[] = [
    { key: 'all', label: 'ALL' },
    { key: 'hot', label: 'HOT' },
    { key: 'gainers', label: 'GAINERS' },
    { key: 'losers', label: 'LOSERS' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search players or teams..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredPlayers}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {!searchQuery && activeFilter === 'all' && (
              <View style={styles.hotSection}>
                <View style={styles.sectionTitleContainer}>
                  <View style={styles.sectionTitleIcon}>
                    <Ionicons name="flame" size={14} color={Colors.accent} />
                  </View>
                  <Text style={styles.sectionTitle}>TRENDING NOW</Text>
                </View>
                <FlatList
                  horizontal
                  data={hotPlayers}
                  keyExtractor={item => `hot-${item.id}`}
                  renderItem={({ item }) => (
                    <HotPlayerCard player={item} onPress={() => handlePlayerPress(item)} />
                  )}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.hotListContent}
                />
              </View>
            )}

            <View style={styles.filterRow}>
              {filters.map(f => (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.filterBtn, activeFilter === f.key && styles.filterBtnActive]}
                  onPress={() => setActiveFilter(f.key)}
                >
                  <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>PLAYER</Text>
              <Text style={styles.listHeaderText}>PRICE / CHANGE</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <PlayerRow player={item} onPress={() => handlePlayerPress(item)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No players found</Text>
            <Text style={styles.emptySubText}>Try a different search</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.md,
    padding: 0,
  },
  hotSection: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 1,
  },
  hotListContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  hotCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    width: 115,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  hotCardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.accent,
    opacity: 0.5,
  },
  hotAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  hotAvatarText: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  hotPlayerName: {
    color: Colors.text,
    fontSize: FontSize.xs,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  hotTeamName: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginBottom: Spacing.xs,
    letterSpacing: 0.3,
  },
  hotPrice: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginBottom: 4,
  },
  hotChangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  hotChangeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.background,
  },
  filterBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterBtnActive: {
    backgroundColor: Colors.accentDim,
    borderColor: Colors.accent,
  },
  filterText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  filterTextActive: {
    color: Colors.accent,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  listHeaderText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
    backgroundColor: Colors.background,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarCircleHot: {
    backgroundColor: Colors.accentDim,
    borderColor: Colors.borderLight,
  },
  avatarText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  playerInfo: {
    flex: 1,
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
    backgroundColor: Colors.accentDim,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  hotText: {
    color: Colors.accent,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  playerMeta: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  priceContainer: {
    alignItems: 'flex-end',
    gap: 3,
  },
  price: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  changeBadgeGreen: {
    backgroundColor: Colors.greenDim,
  },
  changeBadgeRed: {
    backgroundColor: Colors.redDim,
  },
  changeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  changeTextGreen: {
    color: Colors.green,
  },
  changeTextRed: {
    color: Colors.red,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  emptySubText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
});
