export interface Player {
  id: string;
  name: string;
  number: number | null;
  team: string; // 'Sodapop' | 'Chiến Lang' | 'Youth Flowers'
  position: string; // 'Thủ môn' | 'Hậu vệ' | 'Tiền vệ' | 'Tiền đạo'
  isCaptain: boolean;
  image?: string; // base64 representation or fallback
  goals: number;
  yellowCards: number;
  redCards: number;
}

export type EventType = 'goal' | 'yellow' | 'red';

export interface MatchEvent {
  team: string;
  playerId: string;
  type: EventType;
}

export interface Match {
  id: string;
  round: number;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  events: MatchEvent[];
  date: string;
}

export interface Penalty {
  id: string;
  round: number;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
}

export interface Finance {
  id: string;
  date: string;
  content: string;
  revenue: number;
  expense: number;
}

export interface Rule {
  id: string;
  title: string;
  detail: string;
  fileData?: string; // Base64 data for image or PDF download
  link?: string;
}

export interface NewsComment {
  avatar: string;
  name: string;
  role: string;
  comment: string;
  color: string;
  style: 'passionate' | 'analytical' | 'poetic';
}

export interface News {
  id: string;
  round: number;
  type: 'round_summary' | 'match';
  date: string;
  title: string;
  content?: string;
  commentator?: {
    name: string;
    avatar: string;
    color: string;
    style: 'passionate' | 'analytical' | 'poetic';
  };
  comments?: NewsComment[];
  nextRoundPrediction?: string;
  standoutPlayer?: {
    name: string;
    team: string;
    article: string;
  };
}

export interface TeamStanding {
  team: string;
  roundsPlayed: number;
  diff: number;
  points: number;
}

export interface RoundTeamStanding {
  team: string;
  played: number;
  gf: number;
  ga: number;
  gd: number;
  matchPts: number;
  penaltyWins: number; // For tie-breaking
}
