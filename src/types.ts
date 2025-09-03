// Types for the server status dashboard

export interface ServerConfig {
  id: string;
  name: string;
  url: string;
  description: string;
}

export interface ServerStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'loading' | 'error';
  lastUpdate: Date;
  data?: ServerData;
  error?: string;
}

export interface ServerData {
  alliesCount: number;
  axisCount: number;
  gameTime: string;
  alliesScore: number;
  axisScore: number;
  currentMap: string;
  nextMap: string;
  maxPlayers: number;
}

export interface ServerContextType {
  servers: ServerStatus[];
  loading: boolean;
  lastRefresh: Date | null;
  refreshData: () => Promise<void>;
}