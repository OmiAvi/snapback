import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ALL_PLAYERS } from '@/constants/data';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MiniChart({ isPositive }: { isPositive: boolean }) {
  const points = isPositive
    ? [30, 28, 32, 29, 35, 33, 38, 36, 40, 42]
    : [42, 40, 38, 41, 36, 39, 34, 37, 32, 30];

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const width = 200;
  const height = 60;
  const stepX = width / (points.length - 1);

  const pathPoints = points.map((p, i) => {
    const x = i * stepX;
    const y = height - ((p - min) / range) * height;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartLabel}>7-Day Price History</Text>
      <View style={[styles.chartPlaceholder, isPositive ? styles.chartGreen : styles.chartRed]}>
        <View style={styles.chartLine}>
          {points.map((p, i) => (
            <View
              key={i}
              style={[
                styles.chartPoint,
                {
                  left: (i / (points.length - 1)) * 100 + '%',
                  bottom: ((p - min) / range) * 100 + '%',
                  backgroundColor: isPositive ? Colors.green : Colors.red,
                },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.chartAnnotation, isPositive ? { color: Colors.green } : { color: Colors.red }]}>
          {isPositive ? '▲ Trending Up' : '▼ Trending Down'}
        </Text>
      </View>
    </View>
  );
}

export default function PlayerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [shares, setShares] = useState(1);

  const player = ALL_PLAYERS.find(p => p.id === id);

  if (!player) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.red} />
        <Text style={styles.errorText}>Player not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isPositive = player.priceChange >= 0;
  const totalCost = player.stockPrice * shares;

  const handleBuy = () => {
    Alert.alert(
      'Buy Stock',
      `Buy ${shares} share${shares !== 1 ? 's' : ''} of ${player.name} for $${totalCost.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Buy $${totalCost.toFixed(2)}`,
          onPress: () =>
            Alert.alert(
              '🎉 Purchase Complete!',
              `You bought ${shares} share${shares !== 1 ? 's' : ''} of ${player.name} at $${player.stockPrice.toFixed(2)} each.`
            ),
        },
      ]
    );
  };

  const handleSell = () => {
    Alert.alert(
      'Sell Stock',
      `Sell ${shares} share${shares !== 1 ? 's' : ''} of ${player.name} for $${totalCost.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Sell $${totalCost.toFixed(2)}`,
          style: 'destructive',
          onPress: () =>
            Alert.alert(
              '✅ Sale Complete!',
              `You sold ${shares} share${shares !== 1 ? 's' : ''} of ${player.name} at $${player.stockPrice.toFixed(2)} each.`
            ),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <Stack.Screen options={{ title: player.name }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoInitials}>
              {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </Text>
            <View style={[styles.jerseyOverlay]}>
              <Text style={styles.jerseyNum}>#{player.jersey}</Text>
            </View>
          </View>

          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{player.name}</Text>
            <View style={styles.heroBadges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{player.team}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{player.position}</Text>
              </View>
              {player.isHot && (
                <View style={[styles.badge, styles.badgeHot]}>
                  <Text style={styles.badgeText}>🔥 HOT</Text>
                </View>
              )}
            </View>
            <Text style={styles.heroMeta}>{player.year} · {player.height} · {player.hometown}</Text>
          </View>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceMain}>
            <Text style={styles.bigPrice}>${player.stockPrice.toFixed(2)}</Text>
            <View style={[styles.priceBadge, isPositive ? styles.priceBadgeGreen : styles.priceBadgeRed]}>
              <Ionicons
                name={isPositive ? 'trending-up' : 'trending-down'}
                size={16}
                color={isPositive ? Colors.green : Colors.red}
              />
              <Text style={[styles.priceChangeText, isPositive ? styles.textGreen : styles.textRed]}>
                {isPositive ? '+' : ''}${Math.abs(player.priceChange).toFixed(2)} ({isPositive ? '+' : ''}{player.priceChangePercent.toFixed(1)}%)
              </Text>
            </View>
          </View>
          <Text style={styles.priceLabel}>Today's Price</Text>
        </View>

        {/* Mini Chart */}
        <MiniChart isPositive={isPositive} />

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Season Statistics</Text>
          <View style={styles.statsGrid}>
            <StatBox label="PPG" value={player.stats.ppg.toFixed(1)} />
            <StatBox label="RPG" value={player.stats.rpg.toFixed(1)} />
            <StatBox label="APG" value={player.stats.apg.toFixed(1)} />
            {player.stats.spg !== undefined && <StatBox label="SPG" value={player.stats.spg.toFixed(1)} />}
            {player.stats.bpg !== undefined && <StatBox label="BPG" value={player.stats.bpg.toFixed(1)} />}
            {player.stats.fg !== undefined && <StatBox label="FG%" value={player.stats.fg.toFixed(1)} />}
          </View>
        </View>

        {/* Trade Section */}
        <View style={styles.tradeSection}>
          <Text style={styles.sectionTitle}>Trade Stock</Text>

          <View style={styles.sharesControl}>
            <Text style={styles.sharesLabel}>Shares</Text>
            <View style={styles.sharesRow}>
              <TouchableOpacity
                style={[styles.sharesBtn, shares <= 1 && styles.sharesBtnDisabled]}
                onPress={() => setShares(Math.max(1, shares - 1))}
                disabled={shares <= 1}
              >
                <Ionicons name="remove" size={20} color={shares <= 1 ? Colors.textMuted : Colors.text} />
              </TouchableOpacity>
              <Text style={styles.sharesValue}>{shares}</Text>
              <TouchableOpacity
                style={styles.sharesBtn}
                onPress={() => setShares(shares + 1)}
              >
                <Ionicons name="add" size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.totalCost}>Total: ${totalCost.toFixed(2)}</Text>
          </View>

          <View style={styles.tradeButtons}>
            <TouchableOpacity style={styles.buyButton} onPress={handleBuy} activeOpacity={0.8}>
              <Ionicons name="arrow-down-circle" size={20} color={Colors.primaryDark} />
              <Text style={styles.buyButtonText}>Buy Stock</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sellButton} onPress={handleSell} activeOpacity={0.8}>
              <Ionicons name="arrow-up-circle" size={20} color={Colors.text} />
              <Text style={styles.sellButtonText}>Sell Stock</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Market Info */}
        <View style={styles.marketInfo}>
          <Text style={styles.sectionTitle}>Market Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Market Cap</Text>
            <Text style={styles.infoValue}>${(player.stockPrice * 1000).toFixed(2)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>24h Volume</Text>
            <Text style={styles.infoValue}>${(player.stockPrice * 234).toFixed(2)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>52w High</Text>
            <Text style={styles.infoValue}>${(player.stockPrice * 1.35).toFixed(2)}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>52w Low</Text>
            <Text style={styles.infoValue}>${(player.stockPrice * 0.62).toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.disclaimer}>
          * Stock prices are simulated and for entertainment only. Not real financial advice.
        </Text>
      </ScrollView>
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
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  backButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    gap: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.accent,
    position: 'relative',
  },
  photoInitials: {
    color: Colors.white,
    fontSize: FontSize.xxxl,
    fontWeight: 'bold',
  },
  jerseyOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  jerseyNum: {
    color: Colors.primaryDark,
    fontSize: FontSize.xs,
    fontWeight: 'bold',
  },
  heroInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  heroName: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
  },
  heroBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  badge: {
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeHot: {
    backgroundColor: 'rgba(255,127,0,0.15)',
    borderColor: '#ff7f00',
  },
  badgeText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  heroMeta: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  priceSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  priceMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  bigPrice: {
    color: Colors.text,
    fontSize: FontSize.title,
    fontWeight: 'bold',
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  priceBadgeGreen: {
    backgroundColor: 'rgba(0,200,83,0.15)',
  },
  priceBadgeRed: {
    backgroundColor: 'rgba(255,23,68,0.15)',
  },
  priceChangeText: {
    fontSize: FontSize.md,
    fontWeight: 'bold',
  },
  textGreen: {
    color: Colors.green,
  },
  textRed: {
    color: Colors.red,
  },
  priceLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chartLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  chartPlaceholder: {
    height: 80,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
  },
  chartGreen: {
    backgroundColor: 'rgba(0,200,83,0.08)',
    borderTopWidth: 2,
    borderTopColor: Colors.green,
  },
  chartRed: {
    backgroundColor: 'rgba(255,23,68,0.08)',
    borderTopWidth: 2,
    borderTopColor: Colors.red,
  },
  chartLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chartPoint: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    transform: [{ translateX: -2 }, { translateY: 2 }],
  },
  chartAnnotation: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: Spacing.xs,
  },
  statsSection: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    marginBottom: 0,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statBox: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    color: Colors.accent,
    fontSize: FontSize.xl,
    fontWeight: 'bold',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  tradeSection: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    marginBottom: 0,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sharesControl: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sharesLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  sharesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  sharesBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sharesBtnDisabled: {
    opacity: 0.4,
  },
  sharesValue: {
    color: Colors.text,
    fontSize: FontSize.xxxl,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
  totalCost: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: 'bold',
  },
  tradeButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  buyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.green,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  buyButtonText: {
    color: Colors.primaryDark,
    fontSize: FontSize.lg,
    fontWeight: 'bold',
  },
  sellButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.red,
  },
  sellButtonText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: 'bold',
  },
  marketInfo: {
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    marginBottom: 0,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  infoValue: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  disclaimer: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    textAlign: 'center',
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    fontStyle: 'italic',
  },
});
