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
import { Ionicons } from '@expo/vector-icons';
import { MOCK_USER, MOCK_PORTFOLIO, MOCK_TRANSACTIONS } from '@/constants/data';
import { Colors, Spacing, FontSize, BorderRadius, Shadows } from '@/constants/theme';

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderIcon}>
        <Ionicons name={icon as any} size={14} color={Colors.accent} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function StatCard({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, valueColor ? { color: valueColor } : {}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function AccountScreen() {
  const [balance, setBalance] = useState(MOCK_USER.balance);

  const portfolioValue = MOCK_PORTFOLIO.reduce(
    (sum, item) => sum + item.shares * item.currentPrice,
    0
  );

  const totalGain = MOCK_PORTFOLIO.reduce(
    (sum, item) => sum + item.shares * (item.currentPrice - item.avgBuyPrice),
    0
  );

  const handleDeposit = (amount: number) => {
    Alert.alert(
      'Deposit Funds',
      `Add $${amount.toFixed(0)} to your account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setBalance(prev => prev + amount);
            Alert.alert('Success', `$${amount.toFixed(0)} has been added to your account!`);
          },
        },
      ]
    );
  };

  const handleSetting = (setting: string) => {
    if (setting === 'Logout') {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => Alert.alert('Logged out') },
      ]);
    } else {
      Alert.alert(setting, `${setting} settings coming soon!`);
    }
  };

  const depositAmounts = [25, 50, 100, 250];

  const settings = [
    { label: 'Notifications', icon: 'notifications-outline' },
    { label: 'Privacy', icon: 'shield-outline' },
    { label: 'Help & Support', icon: 'help-circle-outline' },
    { label: 'About OnIt', icon: 'information-circle-outline' },
    { label: 'Logout', icon: 'log-out-outline' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>
            {MOCK_USER.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{MOCK_USER.name}</Text>
          <Text style={styles.profileEmail}>{MOCK_USER.email}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.green} />
            <Text style={styles.verifiedText}>Verified Account</Text>
          </View>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatCard label="Cash Balance" value={`$${balance.toFixed(2)}`} />
        <View style={styles.statDivider} />
        <StatCard
          label="Portfolio Value"
          value={`$${portfolioValue.toFixed(2)}`}
          valueColor={Colors.accent}
        />
        <View style={styles.statDivider} />
        <StatCard
          label="Total Gain"
          value={`${totalGain >= 0 ? '+' : ''}$${totalGain.toFixed(2)}`}
          valueColor={totalGain >= 0 ? Colors.green : Colors.red}
        />
      </View>

      {/* Deposit Section */}
      <View style={styles.section}>
        <SectionHeader title="Deposit Funds" icon="wallet-outline" />
        <View style={styles.depositGrid}>
          {depositAmounts.map(amount => (
            <TouchableOpacity
              key={amount}
              style={styles.depositBtn}
              onPress={() => handleDeposit(amount)}
              activeOpacity={0.7}
            >
              <Text style={styles.depositAmount}>${amount}</Text>
              <Text style={styles.depositLabel}>Add Funds</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Portfolio Section */}
      <View style={styles.section}>
        <SectionHeader title="My Portfolio" icon="pie-chart-outline" />
        {MOCK_PORTFOLIO.length === 0 ? (
          <View style={styles.emptySection}>
            <Text style={styles.emptySectionText}>No stocks owned yet</Text>
          </View>
        ) : (
          MOCK_PORTFOLIO.map(item => {
            const gain = item.shares * (item.currentPrice - item.avgBuyPrice);
            const gainPercent = ((item.currentPrice - item.avgBuyPrice) / item.avgBuyPrice) * 100;
            const isPositive = gain >= 0;
            return (
              <View key={item.playerId} style={styles.portfolioRow}>
                <View style={styles.portfolioAvatar}>
                  <Text style={styles.portfolioAvatarText}>
                    {item.playerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </Text>
                </View>
                <View style={styles.portfolioInfo}>
                  <Text style={styles.portfolioName}>{item.playerName}</Text>
                  <Text style={styles.portfolioMeta}>{item.team} · {item.shares} shares</Text>
                </View>
                <View style={styles.portfolioValues}>
                  <Text style={styles.portfolioValue}>${(item.shares * item.currentPrice).toFixed(2)}</Text>
                  <Text style={[styles.portfolioGain, isPositive ? styles.textGreen : styles.textRed]}>
                    {isPositive ? '+' : ''}${gain.toFixed(2)} ({isPositive ? '+' : ''}{gainPercent.toFixed(1)}%)
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Transaction History */}
      <View style={styles.section}>
        <SectionHeader title="Account History" icon="time-outline" />
        {MOCK_TRANSACTIONS.map(tx => (
          <View key={tx.id} style={styles.txRow}>
            <View style={[styles.txIcon, tx.type === 'buy' ? styles.txIconBuy : styles.txIconSell]}>
              <Ionicons
                name={tx.type === 'buy' ? 'arrow-down' : 'arrow-up'}
                size={16}
                color={tx.type === 'buy' ? Colors.green : Colors.red}
              />
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txName}>{tx.playerName}</Text>
              <Text style={styles.txMeta}>
                {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.shares} share{tx.shares !== 1 ? 's' : ''} @ ${tx.price.toFixed(2)}
              </Text>
            </View>
            <View style={styles.txRight}>
              <Text style={[styles.txTotal, tx.type === 'buy' ? styles.textRed : styles.textGreen]}>
                {tx.type === 'buy' ? '-' : '+'}${tx.total.toFixed(2)}
              </Text>
              <Text style={styles.txDate}>{tx.date}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <SectionHeader title="Settings" icon="settings-outline" />
        {settings.map((setting, index) => (
          <TouchableOpacity
            key={setting.label}
            style={[
              styles.settingRow,
              index === settings.length - 1 && styles.settingRowLast,
              setting.label === 'Logout' && styles.settingRowDanger,
            ]}
            onPress={() => handleSetting(setting.label)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={setting.icon as any}
              size={20}
              color={setting.label === 'Logout' ? Colors.red : Colors.textSecondary}
            />
            <Text style={[styles.settingLabel, setting.label === 'Logout' && styles.settingLabelDanger]}>
              {setting.label}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SNAPBACK v1.0.0</Text>
        <Text style={styles.footerDisclaimer}>
          For entertainment purposes only. Not real financial advice.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: Spacing.xxl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  avatarLargeText: {
    color: Colors.accent,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    color: Colors.text,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  profileEmail: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    backgroundColor: Colors.greenDim,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    color: Colors.green,
    fontSize: FontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statValue: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  section: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
  },
  sectionHeaderIcon: {
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
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  depositGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  depositBtn: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  depositAmount: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  depositLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  emptySection: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptySectionText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  portfolioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  portfolioAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  portfolioAvatarText: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  portfolioInfo: {
    flex: 1,
  },
  portfolioName: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  portfolioMeta: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  portfolioValues: {
    alignItems: 'flex-end',
  },
  portfolioValue: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  portfolioGain: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  textGreen: {
    color: Colors.green,
  },
  textRed: {
    color: Colors.red,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconBuy: {
    backgroundColor: Colors.greenDim,
  },
  txIconSell: {
    backgroundColor: Colors.redDim,
  },
  txInfo: {
    flex: 1,
  },
  txName: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  txMeta: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txTotal: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  txDate: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingRowDanger: {
    backgroundColor: Colors.redDim,
  },
  settingLabel: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSize.md,
  },
  settingLabelDanger: {
    color: Colors.red,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: 4,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footerDisclaimer: {
    color: Colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
