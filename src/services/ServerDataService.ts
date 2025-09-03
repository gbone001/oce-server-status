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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(server.apiUrl, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      let data: any;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error('Invalid JSON response');
      }

      const mapped = this.mapApiResponseToStatus(data, server);
      return {
        ...mapped,
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
    } finally {
      clearTimeout(timeout);
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

  private static mapApiResponseToStatus(
    data: any,
    server: ServerConfig
  ): Omit<ServerStatus, 'status' | 'lastUpdated'> {
    const num = (v: any, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
    const str = (v: any, d = 'Unknown') => (typeof v === 'string' && v.trim() !== '' ? v : d);

    // Try multiple common key variants
    const alliesPlayers = num(
      data?.alliesPlayers ?? data?.allies ?? data?.allies_count ?? data?.numAllies ?? data?.num_allies ?? data?.players?.allies ?? data?.player_count_by_team?.allied
    , 0);
    const axisPlayers = num(
      data?.axisPlayers ?? data?.axis ?? data?.axis_count ?? data?.numAxis ?? data?.num_axis ?? data?.players?.axis ?? data?.player_count_by_team?.axis
    , 0);

    const gameTimeRaw = data?.gameTime ?? data?.match_time ?? data?.time ?? data?.game_time;
    const gameTime = typeof gameTimeRaw === 'string'
      ? gameTimeRaw
      : typeof gameTimeRaw === 'number'
        ? String(gameTimeRaw)
        : '--:--';

    const timeRemainingSeconds = num(
      data?.time_remaining ?? data?.remaining_time ?? data?.timeRemaining
    , undefined as any);

    const alliesScore = num(
      data?.alliesScore ?? data?.score?.allied ?? data?.score?.allies ?? data?.allies_score ?? data?.scores?.allies
    , 0);
    const axisScore = num(
      data?.axisScore ?? data?.score?.axis ?? data?.axis_score ?? data?.scores?.axis
    , 0);

    const currentMap = str(
      data?.currentMap ?? data?.map ?? data?.current_map?.map?.id ?? data?.current_map?.map?.name ?? data?.current_map
    , 'Unknown');
    const nextMap = str(
      data?.nextMap ?? data?.next_map?.map?.id ?? data?.next_map?.map?.name ?? data?.next_map ?? data?.nextMapName
    , 'Unknown');

    const shortName = str(
      data?.short_name ?? data?.shortName ?? ''
    , undefined as any);

    return {
      id: server.id,
      name: server.name,
      shortName: shortName || undefined,
      alliesPlayers,
      axisPlayers,
      gameTime,
      timeRemainingSeconds: typeof timeRemainingSeconds === 'number' ? timeRemainingSeconds : undefined,
      alliesScore,
      axisScore,
      currentMap,
      nextMap,
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
