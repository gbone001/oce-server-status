export interface ServerConfig {
  id: string;
  name: string;
  apiUrl: string;
}

export interface ServerStatus {
  id: string;
  name: string;
  status: 'success' | 'error';
  alliesPlayers: number;
  axisPlayers: number;
  gameTime: string;
  alliesScore: number; // 0-5 points
  axisScore: number; // 0-5 points
  currentMap: string;
  nextMap: string;
  lastUpdated: Date;
  error?: string;
}

export interface ServersConfig {
  servers: ServerConfig[];
}

export interface Theme {
  isDark: boolean;
}

export interface AppConfig {
  pollInterval: number; // milliseconds
  theme: Theme;
}