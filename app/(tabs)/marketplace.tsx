import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Polyline } from 'react-native-svg';
import type { Player } from '@/constants/data';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';
import { useAppData } from '@/context/app-data-context';
import { getPlayerImageUri } from '@/utils/player-images';

// Mini sparkline chart component
function Sparkline({ data, isPositive, width = 60, height = 24 }: { 
  data: number[]; 
  isPositive: boolean;
  width?: number;
  height?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={points}
        fill="none"
        stroke={isPositive ? Colors.green : Colors.red}
        strokeWidth="1.5"
      />
    </Svg>
  );
}

// Generate fake sparkline data based on price change
function generateSparklineData(isPositive: boolean): number[] {
  const data = [];
  let value = 50;
  for (let i = 0; i < 20; i++) {
    value += (Math.random() - (isPositive ? 0.4 : 0.6)) * 5;
    data.push(value);
  }
  return data;
}

function PlayerRow({ player, onPress }: { player: Player; onPress: () => void }) {
  const isPositive = player.priceChange >= 0;
  const sparklineData = useMemo(() => generateSparklineData(isPositive), [isPositive]);
  
  return (
    <TouchableOpacity style={styles.playerRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatarCircle}>
        <Image source={{ uri: getPlayerImageUri(player) }} style={styles.avatarImage} resizeMode="cover" />
      </View>
      <View style={styles.playerInfo}>
        <Text style={styles.playerTicker}>{player.name.split(' ')[1]?.slice(0, 4).toUpperCase() || 'PLYR'}</Text>
        <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
      </View>
      <View style={styles.sparklineContainer}>
        <Sparkline data={sparklineData} isPositive={isPositive} />
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>${player.stockPrice.toFixed(2)}</Text>
        <Text style={[styles.changeText, isPositive ? styles.changeTextGreen : styles.changeTextRed]}>
          {isPositive ? '+' : ''}{player.priceChangePercent.toFixed(2)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function WishlistCard({ player, onPress }: { player: Player; onPress: () => void }) {
  const isPositive = player.priceChange >= 0;
  const sparklineData = useMemo(() => generateSparklineData(isPositive), [isPositive]);

  return (
    <TouchableOpacity style={styles.wishlistCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.wishlistHeader}>
        <View style={styles.wishlistAvatar}>
          <Image source={{ uri: getPlayerImageUri(player) }} style={styles.wishlistAvatarImage} resizeMode="cover" />
        </View>
        <View style={styles.wishlistInfo}>
          <Text style={styles.wishlistTicker}>{player.name.split(' ')[1]?.slice(0, 4).toUpperCase() || 'PLYR'}</Text>
          <Text style={styles.wishlistName} numberOfLines={1}>{player.team}</Text>
        </View>
      </View>
      <Text style={[styles.wishlistChange, isPositive ? styles.changeTextGreen : styles.changeTextRed]}>
        {isPositive ? '+' : ''}{player.priceChangePercent.toFixed(2)}%
      </Text>
      <View style={styles.wishlistSparkline}>
        <Sparkline data={sparklineData} isPositive={isPositive} width={100} height={30} />
      </View>
    </TouchableOpacity>
  );
}

export default function MarketplaceScreen() {
  const router = useRouter();
  const { allPlayers } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'hot' | 'gainers' | 'losers'>('all');

  const wishlistPlayers = useMemo(
    () => allPlayers.filter(p => p.isHot).slice(0, 4),
    [allPlayers]
  );

  const filteredPlayers = useMemo(() => {
    let players = [...allPlayers];

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
  }, [searchQuery, activeFilter, allPlayers]);

  const handlePlayerPress = (player: Player) => {
    router.push(`/player/${player.id}`);
  };

  const filters: { key: 'all' | 'hot' | 'gainers' | 'losers'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'hot', label: 'Hot' },
    { key: 'gainers', label: 'Gainers' },
    { key: 'losers', label: 'Losers' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search players"
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterIcon}>
            <Ionicons name="options-outline" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredPlayers}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Wishlist Section */}
            {!searchQuery && activeFilter === 'all' && (
              <View style={styles.wishlistSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Wishlist</Text>
                  <TouchableOpacity>
                    <Ionicons name="add-circle-outline" size={24} color={Colors.accent} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  horizontal
                  data={wishlistPlayers}
                  keyExtractor={item => `wishlist-${item.id}`}
                  renderItem={({ item }) => (
                    <WishlistCard player={item} onPress={() => handlePlayerPress(item)} />
                  )}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.wishlistContent}
                />
              </View>
            )}

            {/* Filter Pills */}
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

            {/* Stocks Section Header */}
            <View style={styles.stocksHeader}>
              <Text style={styles.stocksTitle}>Stocks</Text>
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.round,
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
  filterIcon: {
    padding: Spacing.xs,
  },
  wishlistSection: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  wishlistContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  wishlistCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    width: 180,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  wishlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  wishlistAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  wishlistAvatarImage: {
    width: '100%',
    height: '100%',
  },
  wishlistInfo: {
    flex: 1,
  },
  wishlistTicker: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  wishlistName: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  wishlistChange: {
    fontSize: FontSize.md,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  wishlistSparkline: {
    alignItems: 'flex-end',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surface,
  },
  filterBtnActive: {
    backgroundColor: Colors.text,
  },
  filterText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.white,
  },
  stocksHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  stocksTitle: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.background,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  playerInfo: {
    flex: 1,
  },
  playerTicker: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  playerName: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 1,
  },
  sparklineContainer: {
    width: 60,
    height: 24,
  },
  priceContainer: {
    alignItems: 'flex-end',
    minWidth: 70,
  },
  price: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  changeText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
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
