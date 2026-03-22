import type { DraftRoster, GroupRosterEntry, Player } from '@/constants/data';

const MIN_DRAFT_COST = 8;
const MAX_DRAFT_COST = 40;

export function getDraftPrice(player: Player, allPlayers: Player[]) {
  if (allPlayers.length === 0) {
    return MIN_DRAFT_COST;
  }

  const prices = allPlayers.map((entry) => entry.stockPrice);
  const minStock = Math.min(...prices);
  const maxStock = Math.max(...prices);
  const range = maxStock - minStock;

  if (range <= 0) {
    return MIN_DRAFT_COST;
  }

  const normalized = (player.stockPrice - minStock) / range;
  return Math.round((MIN_DRAFT_COST + normalized * (MAX_DRAFT_COST - MIN_DRAFT_COST)) * 10) / 10;
}

export function getRosterBudgetUsed(playerIds: string[], allPlayers: Player[]) {
  const playerById = new Map(allPlayers.map((player) => [player.id, player]));

  return Math.round(
    playerIds.reduce((sum, playerId) => {
      const player = playerById.get(playerId);
      return sum + (player ? getDraftPrice(player, allPlayers) : 0);
    }, 0) * 10
  ) / 10;
}

export function getRosterScore(playerIds: string[], allPlayers: Player[]) {
  const playerById = new Map(allPlayers.map((player) => [player.id, player]));

  return Math.round(
    playerIds.reduce((sum, playerId) => sum + (playerById.get(playerId)?.priceChangePercent ?? 0), 0) * 10
  ) / 10;
}

export function toGroupRosterEntry(
  userId: string,
  roster: DraftRoster,
  allPlayers: Player[]
): GroupRosterEntry {
  return {
    userId,
    rosterId: roster.id,
    rosterName: roster.name,
    playerIds: roster.playerIds,
    budgetUsed: getRosterBudgetUsed(roster.playerIds, allPlayers),
    updatedAt: new Date().toISOString(),
  };
}
