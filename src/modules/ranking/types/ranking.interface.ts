export interface LeaderStat {
  leader: string;
  leaderName: string;
  wins: number;
  number_of_matches: number;
  total_matches: number;
  raw_win_rate: number;
  play_rate: number;
  weighted_win_rate: number;
  first_win_rate: number;
  second_win_rate: number;
}

export interface LeaderStatCamelCase {
  leader: string;
  leaderName: string;
  wins: number;
  matches: number;
  winRate: number;
  first: string;
  second: string;
}
