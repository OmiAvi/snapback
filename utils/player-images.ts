type PlayerImageInput = {
  name: string;
  headshotUrl?: string;
};

export function getPlayerImageUri(player: PlayerImageInput) {
  if (player.headshotUrl) {
    return player.headshotUrl;
  }

  const seed = encodeURIComponent(player.name);

  return `https://api.dicebear.com/9.x/initials/png?seed=${seed}&size=256&radius=999&fontWeight=700&backgroundType=gradientLinear`;
}
