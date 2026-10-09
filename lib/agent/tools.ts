import { SQUADS, PLAYERS, FORM, PITCH, PlayerStats, PitchReport } from "./data";
import { Squads } from "./types";

export const find_player = (
  name?: string | null,
): [string, PlayerStats] | [null, null] => {
  if (!name) {
    return [null, null];
  }

  const q = name.trim().toLowerCase();

  // 1. Exact (case-insensitive) match
  for (const [full, stats] of Object.entries(PLAYERS)) {
    if (full.toLowerCase() === q) {
      return [full, stats];
    }
  }

  // 2. Substring or last-name match
  const matches = Object.entries(PLAYERS).filter(([full, _stats]) => {
    const fullLower = full.toLowerCase();
    const lastName = fullLower.split(" ").pop() || "";

    return fullLower.includes(q) || lastName.includes(q);
  });

  if (matches.length === 1) {
    // We found exactly one match, so it's safe to return it
    return matches[0] as [string, PlayerStats];
  }

  // If we found 0 matches, or more than 1 (ambiguous), return null
  return [null, null];
};

export const get_match_squads = (match: string): Squads | { error: string } => {
  let key = match.trim();

  if (!SQUADS[key]) {
    // try a loose match on the code pair
    // JavaScript Sets don't have a built-in equality check, so we do it manually.
    const targetSet = new Set(
      key.toLowerCase().replace(" vs ", " ").split(" "),
    );

    for (const k of Object.keys(SQUADS)) {
      const matchSet = new Set(k.toLowerCase().replace(" vs ", " ").split(" "));

      const isMatch =
        targetSet.size === matchSet.size &&
        [...targetSet].every((x) => matchSet.has(x));

      if (isMatch) {
        key = k;
        break;
      }
    }
  }
  if (!SQUADS[key]) {
    return {
      error: `No squad data for '${match}'. Available: ${Object.keys(SQUADS).join(", ")}`,
    };
  }
  return SQUADS[key];
};

export const get_player_stats = (
  player: string,
): (PlayerStats & { name: string }) | { error: string } => {
  const [full, stats] = find_player(player);

  if (!stats || !full) {
    return {
      error: `No stats found for '${player}'. Use a name from get_match_squads.`,
    };
  }
  return { name: full, ...stats };
};

export const search_form = (team: string): string => {
  const code = team.trim().toUpperCase();
  if (!FORM[code]) {
    return `No form notes for '${team}'. Known teams: ${Object.keys(FORM).join(", ")}`;
  }
  return FORM[code];
};

export const get_pitch_report = (
  venue: string,
): PitchReport | { error: string } => {
  const q = venue.trim().toLowerCase();

  for (const [name, report] of Object.entries(PITCH)) {
    if (name.toLowerCase().includes(q)) {
      return report;
    }
  }
  return {
    error: `No pitch report for '${venue}'. Known venues: ${Object.keys(PITCH).join(", ")}`,
  };
};
