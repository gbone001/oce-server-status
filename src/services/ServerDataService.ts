import { ServerConfig, ServerStatus, ServersConfig } from '../types';

export class ServerDataService {
  static async fetchServersConfig(): Promise<ServersConfig> {
    try {
      const configUrl = `${process.env.PUBLIC_URL || ''}/servers.json`;
      const response = await fetch(configUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch servers config: ${response.statusText}`);
      }
      const data = await response.json();
      const validated = this.validateServersConfig(data);
      return validated;
    } catch (error) {
      console.error('Error fetching servers config:', error);
      throw error;
    }
  }

  static async fetchServerStatus(server: ServerConfig): Promise<ServerStatus> {
    try {
      // For demo purposes, generate mock data. Replace with real fetch to server.apiUrl for production.
      const mockData = this.generateMockServerData(server);

      // Simulate API call with random delay
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));

      // Simulate occasional failures
      if (Math.random() < 0.1) {
        throw new Error('Server unreachable');
      }

      return {
        ...mockData,
        status: 'success',
        lastUpdated: new Date(),
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
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private static generateMockServerData(
    server: ServerConfig
  ): Omit<ServerStatus, 'status' | 'lastUpdated'> {
    const maps = [
      'Carentan',
      'Sainte-M\u00E8re-\u00C9glise',
      'Foy',
      'Purple Heart Lane',
      'Hill 400',
    ];
    return {
      id: server.id,
      name: server.name,
      alliesPlayers: Math.floor(Math.random() * 32),
      axisPlayers: Math.floor(Math.random() * 32),
      gameTime: `${Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, '0')}:${Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, '0')}`,
      alliesScore: Math.floor(Math.random() * 6),
      axisScore: Math.floor(Math.random() * 6),
      currentMap: maps[Math.floor(Math.random() * maps.length)],
      nextMap: maps[Math.floor(Math.random() * maps.length)],
    };
  }
}

// Lightweight runtime validation of servers.json
export namespace ServerDataService {
  export function validateServersConfig(input: any): ServersConfig {
    const errors: string[] = [];

    // Accept legacy/simple array format: [{ name, url }]
    if (Array.isArray(input)) {
      const result: ServerConfig[] = [];
      const seenIds = new Set<string>();
      input.forEach((s: any, idx: number) => {
        const path = `servers[${idx}]`;
        if (!s || typeof s !== 'object') {
          errors.push(`${path} must be an object`);
          return;
        }
        const name = typeof s.name === 'string' ? s.name.trim() : '';
        const url = typeof s.url === 'string' ? s.url.trim() : '';
        if (!name) errors.push(`${path}.name must be a non-empty string`);
        if (!url) errors.push(`${path}.url must be a non-empty string`);
        const baseId = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `server-${idx+1}`;
        let id = baseId;
        let salt = 1;
        while (seenIds.has(id)) {
          salt += 1;
          id = `${baseId}-${salt}`;
        }
        seenIds.add(id);
        if (name && url) {
          result.push({ id, name, apiUrl: url });
        }
      });
      if (errors.length > 0) {
        throw new Error(`Invalid servers.json (array format):\n- ${errors.join('\n- ')}`);
      }
      return { servers: result };
    }

    // Object format: { servers: [{ id, name, apiUrl }] }
    if (!input || typeof input !== 'object') {
      throw new Error('Invalid servers.json: root must be an object or an array.');
    }

    const servers = (input as any).servers;
    if (!Array.isArray(servers)) {
      throw new Error('Invalid servers.json: "servers" must be an array.');
    }

    const seenIds = new Set<string>();
    const result: ServerConfig[] = [];
    servers.forEach((s: any, idx: number) => {
      const path = `servers[${idx}]`;
      if (!s || typeof s !== 'object') {
        errors.push(`${path} must be an object`);
        return;
      }
      const { id, name, apiUrl } = s as Partial<ServerConfig>;
      if (typeof id !== 'string' || id.trim() === '') errors.push(`${path}.id must be a non-empty string`);
      if (typeof name !== 'string' || name.trim() === '') errors.push(`${path}.name must be a non-empty string`);
      if (typeof apiUrl !== 'string' || apiUrl.trim() === '') errors.push(`${path}.apiUrl must be a non-empty string`);
      if (typeof id === 'string') {
        if (seenIds.has(id)) errors.push(`${path}.id duplicates an existing id: "${id}"`);
        else seenIds.add(id);
      }
      if (typeof id === 'string' && typeof name === 'string' && typeof apiUrl === 'string') {
        result.push({ id, name, apiUrl });
      }
    });

    if (errors.length > 0) {
      throw new Error(`Invalid servers.json:\n- ${errors.join('\n- ')}`);
    }

    return { servers: result };
  }
}
