import { Server, ServerStatus } from '../types/server';

const MOCK_MAPS = ['de_dust2', 'de_inferno', 'de_mirage', 'de_nuke', 'de_cache', 'de_overpass'];

export class ServerPoller {
  private static instance: ServerPoller;
  private pollingInterval: NodeJS.Timeout | null = null;
  private listeners: ((statuses: ServerStatus[]) => void)[] = [];

  static getInstance(): ServerPoller {
    if (!ServerPoller.instance) {
      ServerPoller.instance = new ServerPoller();
    }
    return ServerPoller.instance;
  }

  async loadServers(): Promise<Server[]> {
    try {
      const response = await fetch('/servers.json');
      if (!response.ok) {
        throw new Error(`Failed to load servers: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading servers:', error);
      return [];
    }
  }

  async pollServer(server: Server): Promise<ServerStatus> {
    // Simulate server polling with realistic mock data
    const startTime = Date.now();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
    
    const ping = Date.now() - startTime;
    const online = Math.random() > 0.1; // 90% chance of being online
    
    if (!online) {
      return {
        id: server.id,
        online: false,
        playerCount: 0,
        maxPlayers: 32,
        map: 'Unknown',
        ping,
        lastUpdated: new Date()
      };
    }

    const playerCount = Math.floor(Math.random() * 33);
    const maxPlayers = 32;
    const map = MOCK_MAPS[Math.floor(Math.random() * MOCK_MAPS.length)];
    
    return {
      id: server.id,
      online,
      playerCount,
      maxPlayers,
      map,
      score: Math.random() > 0.3 ? {
        team1: Math.floor(Math.random() * 16),
        team2: Math.floor(Math.random() * 16)
      } : undefined,
      ping,
      lastUpdated: new Date()
    };
  }

  async pollAllServers(): Promise<ServerStatus[]> {
    const servers = await this.loadServers();
    const pollPromises = servers.map(server => this.pollServer(server));
    return Promise.all(pollPromises);
  }

  subscribe(listener: (statuses: ServerStatus[]) => void): () => void {
    this.listeners.push(listener);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(statuses: ServerStatus[]) {
    this.listeners.forEach(listener => listener(statuses));
  }

  startPolling(intervalMs: number = 60000): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    // Initial poll
    this.pollAllServers().then(statuses => {
      this.notifyListeners(statuses);
    });

    this.pollingInterval = setInterval(async () => {
      try {
        const statuses = await this.pollAllServers();
        this.notifyListeners(statuses);
      } catch (error) {
        console.error('Error polling servers:', error);
      }
    }, intervalMs);
  }

  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}