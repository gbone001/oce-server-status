export interface Server {
  id: string;
  name: string;
  ip: string;
  port: number;
  region: string;
  gameType: string;
}

export interface ServerStatus {
  id: string;
  online: boolean;
  playerCount: number;
  maxPlayers: number;
  map: string;
  score?: {
    team1: number;
    team2: number;
  };
  ping: number;
  lastUpdated: Date;
}

export interface ServerWithStatus extends Server {
  status?: ServerStatus;
}