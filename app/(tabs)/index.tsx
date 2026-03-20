import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BRACKET, TEAMS } from '@/constants/data';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import type { Team } from '@/constants/data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Team logo button component
function TeamLogo({ 
  team, 
  isSelected, 
  onPress, 
  size = 'md' 
}: { 
  team: Team; 
  isSelected?: boolean; 
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const hasPlayers = team.players.length > 0;
  const sizeStyles = {
    sm: { width: 36, height: 36, fontSize: 10 },
    md: { width: 44, height: 44, fontSize: 12 },
    lg: { width: 56, height: 56, fontSize: 14 },
  };
  const s = sizeStyles[size];
  
  // Get initials from team short name
  const initials = team.shortName
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <TouchableOpacity 
      style={[
        styles.teamLogo, 
        { width: s.width, height: s.height },
        isSelected && styles.teamLogoSelected,
        hasPlayers && styles.teamLogoActive,
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.teamLogoText, 
        { fontSize: s.fontSize },
        isSelected && styles.teamLogoTextSelected,
        hasPlayers && styles.teamLogoTextActive,
      ]}>
        {initials}
      </Text>
      <View style={[
        styles.seedIndicator,
        isSelected && styles.seedIndicatorSelected,
      ]}>
        <Text style={[
          styles.seedIndicatorText,
          isSelected && styles.seedIndicatorTextSelected,
        ]}>
          {team.seed}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// Bracket connector line
function BracketLine({ direction }: { direction: 'right' | 'left' }) {
  return (
    <View style={[
      styles.bracketLine,
      direction === 'left' && styles.bracketLineLeft,
    ]} />
  );
}

// Matchup component for bracket view
function BracketMatchup({ 
  team1, 
  team2, 
  selectedTeam,
  onTeamSelect,
  onTeamPress,
}: { 
  team1: Team; 
  team2: Team;
  selectedTeam?: string;
  onTeamSelect: (team: Team) => void;
  onTeamPress: (team: Team) => void;
}) {
  return (
    <View style={styles.matchupContainer}>
      <TouchableOpacity
        onPress={() => team1.players.length > 0 ? onTeamPress(team1) : onTeamSelect(team1)}
        onLongPress={() => team1.players.length > 0 && onTeamPress(team1)}
      >
        <TeamLogo 
          team={team1} 
          isSelected={selectedTeam === team1.id}
          onPress={() => onTeamSelect(team1)}
        />
      </TouchableOpacity>
      <View style={styles.matchupDivider} />
      <TouchableOpacity
        onPress={() => team2.players.length > 0 ? onTeamPress(team2) : onTeamSelect(team2)}
        onLongPress={() => team2.players.length > 0 && onTeamPress(team2)}
      >
        <TeamLogo 
          team={team2} 
          isSelected={selectedTeam === team2.id}
          onPress={() => onTeamSelect(team2)}
        />
      </TouchableOpacity>
    </View>
  );
}

// Region bracket column
function RegionColumn({ 
  region, 
  matchups, 
  selections,
  onTeamSelect,
  onTeamPress,
}: { 
  region: string;
  matchups: { topSeed: Team; bottomSeed: Team }[];
  selections: Record<string, string>;
  onTeamSelect: (team: Team) => void;
  onTeamPress: (team: Team) => void;
}) {
  return (
    <View style={styles.regionColumn}>
      <Text style={styles.regionLabel}>{region.toUpperCase()}</Text>
      <View style={styles.matchupsColumn}>
        {matchups.slice(0, 4).map((matchup, index) => (
          <BracketMatchup
            key={`${region}-${index}`}
            team1={matchup.topSeed}
            team2={matchup.bottomSeed}
            selectedTeam={selections[`${region}-${index}`]}
            onTeamSelect={(team) => {
              onTeamSelect(team);
            }}
            onTeamPress={onTeamPress}
          />
        ))}
      </View>
    </View>
  );
}

// Final Four view
function FinalFourView({ 
  selections, 
  onTeamPress 
}: { 
  selections: Record<string, Team | null>;
  onTeamPress: (team: Team) => void;
}) {
  const finalFourTeams = [
    selections.eastWinner,
    selections.westWinner,
    selections.southWinner,
    selections.midwestWinner,
  ];

  const champion = selections.champion;

  return (
    <View style={styles.finalFourContainer}>
      <Text style={styles.finalFourTitle}>FINAL FOUR</Text>
      
      <View style={styles.finalFourBracket}>
        <View style={styles.finalFourSide}>
          {finalFourTeams.slice(0, 2).map((team, index) => (
            <View key={index} style={styles.finalFourSlot}>
              {team ? (
                <TeamLogo 
                  team={team} 
                  size="lg"
                  onPress={() => onTeamPress(team)}
                  isSelected={champion?.id === team.id}
                />
              ) : (
                <View style={styles.emptySlot}>
                  <Text style={styles.emptySlotText}>?</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.championContainer}>
          <View style={styles.championCircle}>
            {champion ? (
              <>
                <Text style={styles.championInitials}>
                  {champion.shortName.split(' ').map(w => w[0]).join('').slice(0, 3)}
                </Text>
              </>
            ) : (
              <Text style={styles.championPlaceholder}>?</Text>
            )}
          </View>
          <Text style={styles.championLabel}>MY CHAMPION</Text>
          <Text style={styles.championName}>
            {champion?.shortName || 'SELECT WINNER'}
          </Text>
        </View>

        <View style={styles.finalFourSide}>
          {finalFourTeams.slice(2, 4).map((team, index) => (
            <View key={index} style={styles.finalFourSlot}>
              {team ? (
                <TeamLogo 
                  team={team} 
                  size="lg"
                  onPress={() => onTeamPress(team)}
                  isSelected={champion?.id === team.id}
                />
              ) : (
                <View style={styles.emptySlot}>
                  <Text style={styles.emptySlotText}>?</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function BracketScreen() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'bracket' | 'finalfour'>('bracket');
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [finalFourSelections, setFinalFourSelections] = useState<Record<string, Team | null>>({
    eastWinner: null,
    westWinner: null,
    southWinner: null,
    midwestWinner: null,
    champion: null,
  });

  const handleTeamPress = (team: Team) => {
    if (team.players.length > 0) {
      router.push(`/team/${team.id}`);
    }
  };

  const handleTeamSelect = (team: Team) => {
    // For now, just navigate to team if they have players
    if (team.players.length > 0) {
      router.push(`/team/${team.id}`);
    }
  };

  const eastMatchups = BRACKET.find(b => b.region === 'East')?.matchups || [];
  const westMatchups = BRACKET.find(b => b.region === 'West')?.matchups || [];
  const southMatchups = BRACKET.find(b => b.region === 'South')?.matchups || [];
  const midwestMatchups = BRACKET.find(b => b.region === 'Midwest')?.matchups || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Toggle Tabs */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleBtn, activeView === 'bracket' && styles.toggleBtnActive]}
          onPress={() => setActiveView('bracket')}
        >
          <Text style={[styles.toggleText, activeView === 'bracket' && styles.toggleTextActive]}>
            FULL BRACKET
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, activeView === 'finalfour' && styles.toggleBtnActive]}
          onPress={() => setActiveView('finalfour')}
        >
          <Text style={[styles.toggleText, activeView === 'finalfour' && styles.toggleTextActive]}>
            FINAL FOUR
          </Text>
        </TouchableOpacity>
      </View>

      {activeView === 'bracket' ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bracketScrollContent}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.bracketVerticalContent}
          >
            <View style={styles.bracketContainer}>
              {/* Left side - East & South */}
              <View style={styles.bracketHalf}>
                <RegionColumn
                  region="East"
                  matchups={eastMatchups}
                  selections={selections}
                  onTeamSelect={handleTeamSelect}
                  onTeamPress={handleTeamPress}
                />
                <View style={styles.roundColumn}>
                  {/* Round 2 placeholders */}
                  {[0, 1].map(i => (
                    <View key={i} style={styles.advancedSlot}>
                      <View style={styles.emptySlotSmall}>
                        <Text style={styles.emptySlotTextSmall}>?</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <View style={styles.roundColumn}>
                  <View style={styles.advancedSlotLarge}>
                    <View style={styles.emptySlotSmall}>
                      <Text style={styles.emptySlotTextSmall}>?</Text>
                    </View>
                    <Text style={styles.roundLabel}>ELITE 8</Text>
                  </View>
                </View>
              </View>

              {/* Center - Final Four */}
              <View style={styles.centerSection}>
                <View style={styles.finalFourCenter}>
                  <View style={styles.finalFourSlotCenter}>
                    <View style={styles.emptySlotSmall}>
                      <Text style={styles.emptySlotTextSmall}>?</Text>
                    </View>
                  </View>
                  
                  <View style={styles.championSection}>
                    <View style={styles.championCircleSmall}>
                      <Text style={styles.championPlaceholderSmall}>?</Text>
                    </View>
                    <Text style={styles.finalFourLabel}>FINAL FOUR</Text>
                  </View>

                  <View style={styles.finalFourSlotCenter}>
                    <View style={styles.emptySlotSmall}>
                      <Text style={styles.emptySlotTextSmall}>?</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Right side - West & Midwest */}
              <View style={styles.bracketHalf}>
                <View style={styles.roundColumn}>
                  <View style={styles.advancedSlotLarge}>
                    <View style={styles.emptySlotSmall}>
                      <Text style={styles.emptySlotTextSmall}>?</Text>
                    </View>
                    <Text style={styles.roundLabel}>ELITE 8</Text>
                  </View>
                </View>
                <View style={styles.roundColumn}>
                  {[0, 1].map(i => (
                    <View key={i} style={styles.advancedSlot}>
                      <View style={styles.emptySlotSmall}>
                        <Text style={styles.emptySlotTextSmall}>?</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <RegionColumn
                  region="West"
                  matchups={westMatchups}
                  selections={selections}
                  onTeamSelect={handleTeamSelect}
                  onTeamPress={handleTeamPress}
                />
              </View>
            </View>

            {/* Bottom regions */}
            <View style={styles.bracketContainer}>
              <View style={styles.bracketHalf}>
                <RegionColumn
                  region="South"
                  matchups={southMatchups}
                  selections={selections}
                  onTeamSelect={handleTeamSelect}
                  onTeamPress={handleTeamPress}
                />
                <View style={styles.roundColumn}>
                  {[0, 1].map(i => (
                    <View key={i} style={styles.advancedSlot}>
                      <View style={styles.emptySlotSmall}>
                        <Text style={styles.emptySlotTextSmall}>?</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.bracketHalf}>
                <View style={styles.roundColumn}>
                  {[0, 1].map(i => (
                    <View key={i} style={styles.advancedSlot}>
                      <View style={styles.emptySlotSmall}>
                        <Text style={styles.emptySlotTextSmall}>?</Text>
                      </View>
                    </View>
                  ))}
                </View>
                <RegionColumn
                  region="Midwest"
                  matchups={midwestMatchups}
                  selections={selections}
                  onTeamSelect={handleTeamSelect}
                  onTeamPress={handleTeamPress}
                />
              </View>
            </View>

            {/* Hint */}
            <View style={styles.hint}>
              <View style={styles.hintIcon}>
                <Ionicons name="flash" size={12} color={Colors.accent} />
              </View>
              <Text style={styles.hintText}>Tap team logo to view players and trade stocks</Text>
            </View>
          </ScrollView>
        </ScrollView>
      ) : (
        <FinalFourView 
          selections={finalFourSelections}
          onTeamPress={handleTeamPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    margin: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  toggleBtnActive: {
    backgroundColor: Colors.accent,
  },
  toggleText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  toggleTextActive: {
    color: Colors.primaryDark,
  },
  bracketScrollContent: {
    paddingHorizontal: Spacing.md,
  },
  bracketVerticalContent: {
    paddingBottom: Spacing.xxl,
  },
  bracketContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  bracketHalf: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  regionColumn: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  regionLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  matchupsColumn: {
    gap: Spacing.md,
  },
  matchupContainer: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  matchupDivider: {
    width: 30,
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  teamLogo: {
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  teamLogoActive: {
    borderColor: Colors.borderLight,
  },
  teamLogoSelected: {
    backgroundColor: Colors.accentDim,
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  teamLogoText: {
    color: Colors.textMuted,
    fontWeight: '700',
  },
  teamLogoTextActive: {
    color: Colors.textSecondary,
  },
  teamLogoTextSelected: {
    color: Colors.accent,
  },
  seedIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.surface,
    borderRadius: 6,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  seedIndicatorSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  seedIndicatorText: {
    color: Colors.textMuted,
    fontSize: 8,
    fontWeight: '700',
  },
  seedIndicatorTextSelected: {
    color: Colors.primaryDark,
  },
  roundColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  advancedSlot: {
    marginVertical: Spacing.lg,
  },
  advancedSlotLarge: {
    alignItems: 'center',
  },
  emptySlot: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptySlotText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  emptySlotSmall: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptySlotTextSmall: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  roundLabel: {
    color: Colors.textMuted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  finalFourCenter: {
    alignItems: 'center',
  },
  finalFourSlotCenter: {
    marginVertical: Spacing.sm,
  },
  championSection: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  championCircleSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accentDim,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  championPlaceholderSmall: {
    color: Colors.accent,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  finalFourLabel: {
    color: Colors.textMuted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: Spacing.xs,
  },
  // Final Four View Styles
  finalFourContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.lg,
  },
  finalFourTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.lg,
  },
  finalFourBracket: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finalFourSide: {
    gap: Spacing.xl,
  },
  finalFourSlot: {
    alignItems: 'center',
  },
  championContainer: {
    alignItems: 'center',
    marginHorizontal: Spacing.xl,
  },
  championCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accentDim,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  championInitials: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  championPlaceholder: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  championLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: Spacing.sm,
  },
  championName: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '700',
    marginTop: 2,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'center',
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
  bracketLine: {
    width: 20,
    height: 1,
    backgroundColor: Colors.border,
  },
  bracketLineLeft: {
    transform: [{ scaleX: -1 }],
  },
});
