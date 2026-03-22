#!/usr/bin/env python3

import argparse
import json
import re
import sys
import time
import urllib.request
from pathlib import Path


HEADSHOT_RE = re.compile(
    r'<img alt="(https://a\.espncdn\.com/i/headshots/mens-college-basketball/players/full/\d+\.png)"[^>]*title="([^"]+)"'
)
HEADERS = {"User-Agent": "Mozilla/5.0"}

SPECIAL_SLUGS = {
    "ohio-state": ["ohio-state-buckeyes", "osu", "ohio-state"],
    "iowa-state": ["iowa-state-cyclones", "iowast", "iowa-state"],
    "north-carolina": ["north-carolina-tar-heels", "unc", "north-carolina"],
    "texas-am": ["texas-am-aggies", "texas-am", "am"],
    "saint-louis": ["saint-louis-billikens", "saint-louis", "slu"],
    "saint-marys": ["saint-marys-gaels", "saint-marys", "stmarys", "stmarys-ca"],
    "st-johns": ["st-johns-red-storm", "st-johns", "stjohns"],
    "miami-fl": ["miami-hurricanes", "miami-fl", "miami"],
    "miami-oh": ["miami-oh-redhawks", "miamioh", "miami-oh"],
    "uconn": ["connecticut-huskies", "uconn", "connecticut"],
    "south-florida": ["south-florida-bulls", "south-florida", "usf"],
    "cal-baptist": ["california-baptist-lancers", "cal-baptist", "calbaptist"],
    "north-dakota-state": ["north-dakota-state-bison", "north-dakota-state", "northdakotast"],
    "high-point": ["high-point-panthers", "high-point", "highpoint"],
    "prairie-view": ["prairie-view-am-panthers", "prairie-view", "prairieviewam"],
    "tennessee-state": ["tennessee-state-tigers", "tennessee-state", "tnstate"],
    "mcneese": ["mcneese-cowboys", "mcneese", "mcneese-state"],
    "vcu": ["vcu-rams", "vcu"],
    "ucf": ["ucf-knights", "ucf"],
    "ucla": ["ucla-bruins", "ucla"],
    "byu": ["byu-cougars", "byu"],
    "liu": ["liu-sharks", "liu"],
    "purdue": ["purdue-boilermakers", "purdue"],
    "duke": ["duke-blue-devils", "duke"],
    "kansas": ["kansas-jayhawks", "kansas"],
    "arizona": ["arizona-wildcats", "arizona"],
    "wisconsin": ["wisconsin-badgers", "wisconsin"],
    "arkansas": ["arkansas-razorbacks", "arkansas"],
    "gonzaga": ["gonzaga-bulldogs", "gonzaga"],
    "michigan": ["michigan-wolverines", "michigan"],
    "tennessee": ["tennessee-volunteers", "tennessee"],
    "virginia": ["virginia-cavaliers", "virginia"],
    "kentucky": ["kentucky-wildcats", "kentucky"],
    "florida": ["florida-gators", "florida"],
    "illinois": ["illinois-fighting-illini", "illinois"],
    "idaho": ["idaho-vandals", "idaho"],
    "houston": ["houston-cougars", "houston"],
    "alabama": ["alabama-crimson-tide", "alabama"],
    "villanova": ["villanova-wildcats", "villanova"],
    "louisville": ["louisville-cardinals", "louisville"],
    "michigan-state": ["michigan-state-spartans", "michigan-state", "msu"],
    "nebraska": ["nebraska-cornhuskers", "nebraska"],
    "clemson": ["clemson-tigers", "clemson"],
    "iowa": ["iowa-hawkeyes", "iowa"],
    "texas-tech": ["texas-tech-red-raiders", "texas-tech"],
    "texas": ["texas-longhorns", "texas"],
    "georgia": ["georgia-bulldogs", "georgia"],
    "missouri": ["missouri-tigers", "missouri"],
    "vanderbilt": ["vanderbilt-commodores", "vanderbilt"],
    "penn": ["penn-quakers", "penn"],
    "akron": ["akron-zips", "akron"],
    "troy": ["troy-trojans", "troy"],
    "howard": ["howard-bison", "howard"],
    "hofstra": ["hofstra-pride", "hofstra"],
    "furman": ["furman-paladins", "furman"],
    "utah-state": ["utah-state-aggies", "utah-state"],
    "hawaii": ["hawaii-rainbow-warriors", "hawaii"],
    "queens": ["queens-university-royals", "queens"],
    "wright-state": ["wright-state-raiders", "wright-state"],
    "santa-clara": ["santa-clara-broncos", "santa-clara"],
    "cal-baptist": ["california-baptist-lancers", "cal-baptist", "calbaptist"],
    "tennessee-state": ["tennessee-state-tigers", "tennessee-state", "tnstate"],
    "north-dakota-state": ["north-dakota-state-bison", "north-dakota-state", "northdakotast"],
}


def normalize(name: str) -> str:
    text = name.lower()
    for token in ["'", ".", ",", "(", ")", "-", "&"]:
        text = text.replace(token, " ")
    for token in [" jr", " sr", " ii", " iii", " iv"]:
        text = text.replace(token, " ")
    return " ".join(text.split())


def to_combiner(url: str) -> str:
    return (
        url.replace(
            "https://a.espncdn.com/i/headshots/",
            "https://a.espncdn.com/combiner/i?img=/i/headshots/",
        )
        + "&w=350&h=254"
    )


def candidates(team_key: str) -> list[str]:
    base = SPECIAL_SLUGS.get(team_key, [])
    fallback = [
        team_key,
        team_key.replace("-", ""),
        team_key.replace("-", "_"),
    ]
    ordered: list[str] = []
    for slug in [*base, *fallback]:
        if slug not in ordered:
            ordered.append(slug)
    return ordered


def fetch_roster(slug: str, cache: dict[str, dict[str, str] | None]) -> dict[str, str] | None:
    if slug in cache:
        return cache[slug]

    urls = [
        f"https://www.espn.com/mens-college-basketball/team/roster/_/name/{slug}",
    ]
    if "-" in slug:
        prefix, _, suffix = slug.partition("-")
        if prefix and suffix:
            urls.append(
                f"https://www.espn.com/mens-college-basketball/team/roster/_/name/{prefix}/{slug}"
            )

    for url in urls:
        try:
            request = urllib.request.Request(url, headers=HEADERS)
            html = urllib.request.urlopen(request, timeout=20).read().decode("utf-8", "ignore")
        except Exception:
            continue
        if "Team Roster" not in html:
            continue
        pairs = HEADSHOT_RE.findall(html)
        if not pairs:
            continue
        parsed = {normalize(title): to_combiner(image_url) for image_url, title in pairs}
        cache[slug] = parsed
        time.sleep(0.15)
        return parsed

    cache[slug] = None
    return None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--overwrite", action="store_true")
    parser.add_argument("--write", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    data_path = Path("firebase/app-data.2026.json")
    data = json.loads(data_path.read_text())
    cache: dict[str, dict[str, str] | None] = {}
    matched: dict[str, str] = {}
    team_results = []
    missing_by_team: dict[str, list[str]] = {}

    for team_key, team in data["teams"].items():
        candidates_for_team = [
            (player, player["name"], normalize(player["name"]))
            for player in team["players"]
            if args.overwrite or not player.get("headshotUrl")
        ]
        if not candidates_for_team:
            continue

        chosen_slug = None
        chosen_roster = None
        chosen_score = -1

        for slug in candidates(team_key):
            roster = fetch_roster(slug, cache)
            if not roster:
                continue

            score = 0
            for _, _, normalized_name in candidates_for_team:
                if normalized_name in roster:
                    score += 1
                    continue
                if any(
                    normalized_name == roster_name
                    or normalized_name in roster_name
                    or roster_name in normalized_name
                    for roster_name in roster
                ):
                    score += 1

            if score > chosen_score:
                chosen_slug = slug
                chosen_roster = roster
                chosen_score = score

            if score == len(candidates_for_team):
                break

        team_missing: list[str] = []
        if chosen_roster:
            for player, original_name, normalized_name in candidates_for_team:
                image_url = chosen_roster.get(normalized_name)
                if not image_url:
                    for roster_name, roster_url in chosen_roster.items():
                        if (
                            normalized_name == roster_name
                            or normalized_name in roster_name
                            or roster_name in normalized_name
                        ):
                            image_url = roster_url
                            break

                if image_url:
                    matched[original_name] = image_url
                    if args.write:
                        player["headshotUrl"] = image_url
                else:
                    team_missing.append(original_name)
        else:
            team_missing = [original_name for _, original_name, _ in candidates_for_team]

        team_results.append(
            {
                "teamKey": team_key,
                "teamName": team["name"],
                "slug": chosen_slug,
                "matched": len(candidates_for_team) - len(team_missing),
                "expected": len(candidates_for_team),
            }
        )

        if team_missing:
            missing_by_team[team_key] = team_missing

    output_dir = Path("tmp")
    output_dir.mkdir(exist_ok=True)
    (output_dir / "espn-headshots-by-name.json").write_text(json.dumps(matched, indent=2, sort_keys=True))
    (output_dir / "espn-headshot-team-results.json").write_text(json.dumps(team_results, indent=2))
    (output_dir / "espn-headshot-missing-by-team.json").write_text(json.dumps(missing_by_team, indent=2))

    if args.write:
        data_path.write_text(json.dumps(data, indent=2) + "\n")

    summary = {
        "matchedPlayers": len(matched),
        "missingPlayers": sum(1 for team in data["teams"].values() for player in team["players"] if not player.get("headshotUrl")),
        "matchedSample": list(matched.items())[:20],
        "missingTeamsSample": dict(list(missing_by_team.items())[:15]),
    }
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
