import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Image,
  Linking,
  Animated,
} from 'react-native';
import type { DimensionValue } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';
import { useTrading } from '@/context/trading-context';
import { useAppData } from '@/context/app-data-context';
import { getPlayerImageUri } from '@/utils/player-images';

const BUNDLED_HIGHLIGHTS: Record<string, number> = {
  'chase-johnston-hp': require('../../assets/videos/chase-johnston-highlight.mp4'),
};

const ADEN_HOLLOWAY_ID = 'ala-p2';
const BENNETT_STIRTZ_ID = 'iowa-p1';
const BUY_EFFECT_EMOJIS: Record<string, string> = {
  [ADEN_HOLLOWAY_ID]: '🍃',
  [BENNETT_STIRTZ_ID]: '🧱',
};
const PLAYER_NEWS: Record<
  string,
  { title: string; source: string; body: string; url: string }[]
> = {
  [ADEN_HOLLOWAY_ID]: [
    {
      title: 'Breaking News',
      source: 'ESPN On X',
      body:
        "Alabama star Aden Holloway has been arrested on a felony drug charge, four days before his team is set to play in the NCAA tournament.\n\nHolloway, the team's second leading scorer, has been charged with first-degree possession of marijuana and failure to affix a tax stamp.",
      url: 'https://x.com/espn/status/2033583597249024044?s=20',
    },
  ],
};
const PLAYER_NIL_URLS: Record<string, string> = {
  'uk-p1':
    'https://www.ukteamshop.com/mens-nike-royal-kentucky-wildcats-nil-pick-a-player-mens-basketball-jersey/p-355568143273102127+z-91-163934299?_ref=p-CLP:m-GRID:i-r0c0:po-0&aid=10413387',
};
const LEAF_FALLERS = [
  { left: '6%', delay: 0, duration: 1800, size: 30, rotate: '-10deg' },
  { left: '16%', delay: 180, duration: 2100, size: 26, rotate: '12deg' },
  { left: '28%', delay: 100, duration: 1900, size: 34, rotate: '-18deg' },
  { left: '41%', delay: 260, duration: 2200, size: 28, rotate: '9deg' },
  { left: '54%', delay: 60, duration: 2000, size: 32, rotate: '-8deg' },
  { left: '67%', delay: 220, duration: 2050, size: 27, rotate: '14deg' },
  { left: '79%', delay: 140, duration: 1950, size: 31, rotate: '-12deg' },
  { left: '89%', delay: 320, duration: 2150, size: 25, rotate: '7deg' },
  { left: '10%', delay: 90, duration: 2350, size: 24, rotate: '16deg' },
  { left: '21%', delay: 300, duration: 1850, size: 29, rotate: '-6deg' },
  { left: '33%', delay: 40, duration: 2250, size: 27, rotate: '20deg' },
  { left: '46%', delay: 360, duration: 1950, size: 35, rotate: '-15deg' },
  { left: '58%', delay: 150, duration: 2300, size: 26, rotate: '11deg' },
  { left: '71%', delay: 280, duration: 1880, size: 30, rotate: '-20deg' },
  { left: '83%', delay: 120, duration: 2400, size: 24, rotate: '5deg' },
  { left: '93%', delay: 400, duration: 2000, size: 28, rotate: '-9deg' },
];

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statBoxGlow} />
    </View>
  );
}

function asPercent(value: number): DimensionValue {
  return `${value}%`;
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
                  left: asPercent((i / (points.length - 1)) * 100),
                  bottom: asPercent(((p - min) / range) * 100),
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

function getYoutubeThumbnail(url: string) {
  const match = url.match(/(?:shorts\/|watch\?v=|youtu\.be\/)([\w-]{11})/);

  if (!match) {
    return null;
  }

  return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
}

function BundledHighlightCard({ playerName, source }: { playerName: string; source: number }) {
  const player = useVideoPlayer(source, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.play();
  });

  return (
    <View style={styles.highlightCard}>
      <VideoView
        player={player}
        style={styles.highlightVideo}
        nativeControls
        contentFit="cover"
        allowsFullscreen
      />
      <View style={styles.highlightContent}>
        <Text style={styles.highlightTitle}>{playerName} HITS LOGO 3</Text>
        <Text style={styles.highlightSubtitle}>High Point Upsets Wisco</Text>
      </View>
    </View>
  );
}

function ExternalHighlightCard({
  playerName,
  highlightVideoUrl,
}: {
  playerName: string;
  highlightVideoUrl: string;
}) {
  const highlightThumbnail = getYoutubeThumbnail(highlightVideoUrl);

  const openHighlight = () => {
    void Linking.openURL(highlightVideoUrl);
  };

  return (
    <TouchableOpacity style={styles.highlightCard} onPress={openHighlight} activeOpacity={0.85}>
      {highlightThumbnail ? (
        <Image source={{ uri: highlightThumbnail }} style={styles.highlightThumbnail} resizeMode="cover" />
      ) : (
        <View style={[styles.highlightThumbnail, styles.highlightFallback]}>
          <Ionicons name="play-circle" size={40} color={Colors.accent} />
        </View>
      )}
      <View style={styles.highlightOverlay}>
        <View style={styles.highlightPlayButton}>
          <Ionicons name="play" size={18} color={Colors.white} />
        </View>
      </View>
      <View style={styles.highlightContent}>
        <Text style={styles.highlightTitle}>{playerName} Live Highlights</Text>
        <Text style={styles.highlightSubtitle}>Watch this YouTube Shorts clip</Text>
      </View>
    </TouchableOpacity>
  );
}

function NewsCard({
  title,
  source,
  body,
  url,
}: {
  title: string;
  source: string;
  body: string;
  url: string;
}) {
  const openNews = () => {
    void Linking.openURL(url);
  };

  return (
    <TouchableOpacity style={styles.newsCard} onPress={openNews} activeOpacity={0.85}>
      <View style={styles.newsCardHeader}>
        <View style={styles.newsIconWrap}>
          <Ionicons name="newspaper-outline" size={22} color={Colors.accent} />
        </View>
        <View style={styles.newsContent}>
          <Text style={styles.newsTitle}>{title}</Text>
          <Text style={styles.newsSubtitle}>{source}</Text>
        </View>
        <Ionicons name="open-outline" size={18} color={Colors.textMuted} />
      </View>
      <Text style={styles.newsBody}>{body}</Text>
    </TouchableOpacity>
  );
}

export default function PlayerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { allPlayers } = useAppData();
  const [shares, setShares] = useState(1);
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell' | null>(null);
  const [tradeMessage, setTradeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showBuyEffect, setShowBuyEffect] = useState(false);
  const { balance, buyShares, sellShares, getHolding } = useTrading();
  const buyEffectAnimations = React.useRef(LEAF_FALLERS.map(() => new Animated.Value(0))).current;

  const player = allPlayers.find(p => p.id === id);

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
  const bundledHighlightSource = BUNDLED_HIGHLIGHTS[player.id];
  const playerNews = PLAYER_NEWS[player.id] ?? [];
  const holding = getHolding(player.id);
  const ownedShares = holding?.shares ?? 0;
  const canSellSelectedShares = ownedShares >= shares;
  const buyEffectEmoji = BUY_EFFECT_EMOJIS[player.id];
  const nilSupportUrl =
    PLAYER_NIL_URLS[player.id] ??
    `https://www.google.com/search?q=${encodeURIComponent(`${player.name} ${player.team} NIL donation`)}`;

  const dismissTradeModal = () => {
    setTradeAction(null);
  };

  const triggerBuyEffect = () => {
    if (!buyEffectEmoji) {
      return;
    }

    setShowBuyEffect(true);
    buyEffectAnimations.forEach((value) => value.setValue(0));

    Animated.parallel(
      LEAF_FALLERS.map((leaf, index) =>
        Animated.timing(buyEffectAnimations[index], {
          toValue: 1,
          duration: leaf.duration,
          delay: leaf.delay,
          useNativeDriver: true,
        })
      )
    ).start(() => {
      setShowBuyEffect(false);
    });
  };

  const openTradeModal = (action: 'buy' | 'sell') => {
    setTradeMessage(null);

    if (action === 'sell' && !canSellSelectedShares) {
      setTradeMessage({
        type: 'error',
        text: `You only own ${ownedShares} share${ownedShares === 1 ? '' : 's'} of ${player.name}.`,
      });
      return;
    }

    setTradeAction(action);
  };

  const handleConfirmTrade = () => {
    if (!tradeAction) {
      return;
    }

    const result = tradeAction === 'buy' ? buyShares(player, shares) : sellShares(player, shares);

    if (!result.ok) {
      setTradeMessage({ type: 'error', text: result.reason });
      dismissTradeModal();
      return;
    }

    setTradeMessage({
      type: 'success',
      text:
        tradeAction === 'buy'
          ? `Bought ${shares} share${shares !== 1 ? 's' : ''} of ${player.name} for $${result.total.toFixed(2)}. You now own ${result.sharesOwned} share${result.sharesOwned !== 1 ? 's' : ''}.`
          : `Sold ${shares} share${shares !== 1 ? 's' : ''} of ${player.name} for $${result.total.toFixed(2)}. You now own ${result.sharesOwned} share${result.sharesOwned !== 1 ? 's' : ''}.`,
    });
    if (tradeAction === 'buy') {
      triggerBuyEffect();
    }
    dismissTradeModal();
  };

  const openNilSupport = () => {
    void Linking.openURL(nilSupportUrl);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <Stack.Screen options={{ title: 'OnIt' }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.photoPlaceholder}>
            <Image
              source={{ uri: getPlayerImageUri(player) }}
              style={styles.playerPhoto}
              resizeMode="cover"
            />
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

        {playerNews.length > 0 ? (
          <View style={styles.newsSection}>
            <Text style={styles.sectionTitle}>Live News</Text>
            {playerNews.map((item) => (
              <NewsCard
                key={item.url}
                title={item.title}
                source={item.source}
                body={item.body}
                url={item.url}
              />
            ))}
          </View>
        ) : null}

        {(bundledHighlightSource || player.highlightVideoUrl) && (
          <View style={styles.highlightsSection}>
            <Text style={styles.sectionTitle}>Live Highlights</Text>
            {bundledHighlightSource ? (
              <BundledHighlightCard playerName={player.name} source={bundledHighlightSource} />
            ) : player.highlightVideoUrl ? (
              <ExternalHighlightCard playerName={player.name} highlightVideoUrl={player.highlightVideoUrl} />
            ) : null}
          </View>
        )}

        {/* Trade Section */}
        <View style={styles.tradeSection}>
          <Text style={styles.sectionTitle}>Trade Stock</Text>

          <View style={styles.positionCard}>
            <View>
              <Text style={styles.positionLabel}>Cash Available</Text>
              <Text style={styles.positionValue}>${balance.toFixed(2)}</Text>
            </View>
            <View style={styles.positionDivider} />
            <View>
              <Text style={styles.positionLabel}>Shares Owned</Text>
              <Text style={styles.positionValue}>{ownedShares}</Text>
            </View>
          </View>

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
            <TouchableOpacity style={styles.buyButton} onPress={() => openTradeModal('buy')} activeOpacity={0.8}>
              <Ionicons name="arrow-down-circle" size={20} color={Colors.primaryDark} />
              <Text style={styles.buyButtonText}>Buy Stock</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sellButton, !canSellSelectedShares && styles.sellButtonDisabled]}
              onPress={() => openTradeModal('sell')}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-up-circle" size={20} color={Colors.text} />
              <Text style={styles.sellButtonText}>Sell Stock</Text>
            </TouchableOpacity>
          </View>

          {tradeMessage && (
            <View
              style={[
                styles.tradeMessage,
                tradeMessage.type === 'success' ? styles.tradeMessageSuccess : styles.tradeMessageError,
              ]}
            >
              <Ionicons
                name={tradeMessage.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
                size={18}
                color={tradeMessage.type === 'success' ? Colors.green : Colors.red}
              />
              <Text style={styles.tradeMessageText}>{tradeMessage.text}</Text>
            </View>
          )}
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

        <View style={styles.nilSection}>
          <Text style={styles.sectionTitle}>Support Their NIL</Text>
          <Text style={styles.nilDescription}>
            Open an external NIL support page for {player.name} and explore available giving options.
          </Text>
          <TouchableOpacity
            style={styles.nilDonateButton}
            onPress={openNilSupport}
            activeOpacity={0.85}
          >
            <Ionicons name="open-outline" size={18} color={Colors.white} />
            <Text style={styles.nilDonateButtonText}>Open NIL Support Page</Text>
          </TouchableOpacity>
          <Text style={styles.nilDisclaimer}>
            External link that goes directly to player's NIL page.
          </Text>
        </View>

        <Text style={styles.disclaimer}>
          * Stock prices are simulated and for entertainment only. Not real financial advice.
        </Text>
      </ScrollView>

      {showBuyEffect && buyEffectEmoji ? (
        <View pointerEvents="none" style={styles.leafOverlay}>
          {LEAF_FALLERS.map((leaf, index) => {
            const animation = buyEffectAnimations[index];

            return (
              <Animated.Text
                key={`${leaf.left}-${index}`}
                style={[
                  styles.leafEmoji,
                  {
                    left: leaf.left,
                    fontSize: leaf.size,
                    transform: [
                      { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [-60, 860] }) },
                      {
                        translateX: animation.interpolate({
                          inputRange: [0, 0.25, 0.5, 0.75, 1],
                          outputRange: [
                            0,
                            index % 2 === 0 ? 10 : -10,
                            index % 2 === 0 ? 24 : -24,
                            index % 2 === 0 ? -8 : 8,
                            index % 2 === 0 ? -14 : 14,
                          ],
                        }),
                      },
                      {
                        rotate: animation.interpolate({
                          inputRange: [0, 0.25, 0.5, 0.75, 1],
                          outputRange: [
                            leaf.rotate,
                            index % 2 === 0 ? '8deg' : '-8deg',
                            index % 2 === 0 ? '-14deg' : '14deg',
                            index % 2 === 0 ? '6deg' : '-6deg',
                            index % 2 === 0 ? '-10deg' : '10deg',
                          ],
                        }),
                      },
                    ],
                    opacity: animation.interpolate({
                      inputRange: [0, 0.08, 0.9, 1],
                      outputRange: [0, 0.95, 0.95, 0],
                    }),
                  },
                ]}
              >
                {buyEffectEmoji}
              </Animated.Text>
            );
          })}
        </View>
      ) : null}

      <Modal
        visible={tradeAction !== null}
        transparent
        animationType="fade"
        onRequestClose={dismissTradeModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{tradeAction === 'buy' ? 'Confirm Buy' : 'Confirm Sell'}</Text>
            <Text style={styles.modalText}>
              {tradeAction === 'buy' ? 'Buy' : 'Sell'} {shares} share{shares !== 1 ? 's' : ''} of {player.name} for ${totalCost.toFixed(2)}?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalSecondaryButton} onPress={dismissTradeModal} activeOpacity={0.8}>
                <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalPrimaryButton,
                  tradeAction === 'sell' && styles.modalPrimaryButtonSell,
                ]}
                onPress={handleConfirmTrade}
                activeOpacity={0.8}
              >
                <Text style={styles.modalPrimaryButtonText}>
                  {tradeAction === 'buy' ? 'Confirm Buy' : 'Confirm Sell'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: Colors.accentDim,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  backButtonText: {
    color: Colors.accent,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  playerPhoto: {
    width: '100%',
    height: '100%',
  },
  jerseyOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.text,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  jerseyNum: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  heroInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  heroName: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  heroBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  badge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
  },
  badgeHot: {
    backgroundColor: Colors.greenLight,
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
    backgroundColor: Colors.background,
    padding: Spacing.lg,
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
    fontWeight: '700',
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  priceBadgeGreen: {
    backgroundColor: Colors.greenLight,
  },
  priceBadgeRed: {
    backgroundColor: Colors.redLight,
  },
  priceChangeText: {
    fontSize: FontSize.md,
    fontWeight: '700',
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
    backgroundColor: Colors.card,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  chartLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  chartPlaceholder: {
    height: 80,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
  },
  chartGreen: {
    backgroundColor: Colors.greenLight,
  },
  chartRed: {
    backgroundColor: Colors.redLight,
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
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: Spacing.xs,
    letterSpacing: 0.5,
  },
  statsSection: {
    backgroundColor: Colors.card,
    margin: Spacing.md,
    marginBottom: 0,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  highlightsSection: {
    backgroundColor: Colors.card,
    margin: Spacing.md,
    marginBottom: 0,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  newsSection: {
    backgroundColor: Colors.card,
    margin: Spacing.md,
    marginBottom: 0,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statBox: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statBoxGlow: {
    display: 'none',
  },
  statValue: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  highlightCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  highlightVideo: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.surface,
  },
  highlightThumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.surface,
  },
  highlightFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightPlayButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightContent: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  highlightTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  highlightSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  newsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  newsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  newsIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsContent: {
    flex: 1,
    gap: 2,
  },
  newsTitle: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  newsSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  newsBody: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 21,
  },
  tradeSection: {
    backgroundColor: Colors.card,
    margin: Spacing.md,
    marginBottom: 0,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  positionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  positionLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginBottom: 4,
  },
  positionValue: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  positionDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
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
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sharesBtnDisabled: {
    opacity: 0.4,
  },
  sharesValue: {
    color: Colors.text,
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'center',
  },
  totalCost: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '700',
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
    backgroundColor: Colors.text,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  buyButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  sellButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  sellButtonText: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  sellButtonDisabled: {
    opacity: 0.45,
  },
  tradeMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
  },
  tradeMessageSuccess: {
    backgroundColor: Colors.greenLight,
    borderColor: Colors.green,
  },
  tradeMessageError: {
    backgroundColor: Colors.redLight,
    borderColor: Colors.red,
  },
  tradeMessageText: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 22, 40, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  modalText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  modalSecondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.md,
  },
  modalSecondaryButtonText: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  modalPrimaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.text,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.md,
  },
  modalPrimaryButtonSell: {
    backgroundColor: Colors.red,
  },
  modalPrimaryButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  marketInfo: {
    backgroundColor: Colors.card,
    margin: Spacing.md,
    marginBottom: 0,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  nilSection: {
    backgroundColor: Colors.card,
    margin: Spacing.md,
    marginBottom: 0,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
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
    fontSize: FontSize.sm,
    letterSpacing: 0.3,
  },
  infoValue: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  nilDescription: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 20,
    marginTop: -Spacing.xs,
  },
  nilDonateButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  nilDonateButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  nilDisclaimer: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: Spacing.sm,
  },
  leafOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 10,
    elevation: 10,
  },
  leafEmoji: {
    position: 'absolute',
    top: -40,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  disclaimer: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    textAlign: 'center',
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    letterSpacing: 0.3,
  },
});
