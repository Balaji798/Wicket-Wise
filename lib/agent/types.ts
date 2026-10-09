export const VENUE = "MA Chidambaram Stadium, Chepauk";

export interface PitchReport {
  venue: string;
  surface: string;
  avg_first_innings: number;
  pace_vs_spin: string;
  dew: string;
  recommendation: string;
}

export interface PlayerStats {
  team: "CSK" | "MI"; // Strict typing for the teams
  role: "WK" | "BAT" | "AR" | "BOWL";
  credits: number;
  recent: number[];
  batting_avg?: number; // Optional because bowlers might not have this
  strike_rate?: number; // Optional
  bowling_econ?: number; // Optional because pure batters might not have this
  avg_fantasy_points: number;
  note: string;
}

export interface Squads {
  venue: string;
  teams: {
    CSK: string[];
    MI: string[];
  };
}
