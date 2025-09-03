import { ServerConfig, ServerStatus, ServersConfig } from '../types';

export class ServerDataService {
  static async fetchServersConfig(): Promise<ServersConfig> {
    try {
      // Use process.env.PUBLIC_URL to handle different base paths
      const configUrl = `${process.env.PUBLIC_URL || ''}/servers.json`;
      const response = await fetch(configUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch servers config: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching servers config:', error);
      throw error;
    }
  }

  static async fetchServerStatus(server: ServerConfig): Promise<ServerStatus> {
    try {
      // For demo purposes, we'll generate mock data since actual server APIs may not exist
      // In a real implementation, this would fetch from server.apiUrl
      
      const mockData = this.generateMockServerData(server);
      
      // Simulate API call with random delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      // Simulate occasional failures
      if (Math.random() < 0.1) {
        throw new Error('Server unreachable');
      }
      
      return {
        ...mockData,
        status: 'success',
        lastUpdated: new Date()
      };
    } catch (error) {
      return {
        id: server.id,
        name: server.name,
        status: 'error',
        alliesPlayers: 0,
        axisPlayers: 0,
        gameTime: '--:--',
        alliesScore: 0,
        axisScore: 0,
        currentMap: 'Unknown',
        nextMap: 'Unknown',
        lastUpdated: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private static generateMockServerData(server: ServerConfig): Omit<ServerStatus, 'status' | 'lastUpdated'> {
    return {
      id: server.id,
      name: server.name,
      alliesPlayers: Math.floor(Math.random() * 32),
      axisPlayers: Math.floor(Math.random() * 32),
      gameTime: `${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      alliesScore: Math.floor(Math.random() * 6),
      axisScore: Math.floor(Math.random() * 6),
      currentMap: ['Carentan', 'Sainte-Mère-Église', 'Foy', 'Purple Heart Lane', 'Hill 400'][Math.floor(Math.random() * 5)],
      nextMap: ['Carentan', 'Sainte-Mère-Église', 'Foy', 'Purple Heart Lane', 'Hill 400'][Math.floor(Math.random() * 5)]
    };
  }
}