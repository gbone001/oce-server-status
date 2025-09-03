import { ServerConfig, ServerStatus, ServerData } from '../types';

const API_TIMEOUT = 10000; // 10 seconds

// Mock data generator for demonstration since we don't have real server APIs
const generateMockServerData = (): ServerData => {
  const maps = [
    'Kursk', 'Stalingrad', 'Carentan', 'Foy', 'Purple Heart Lane',
    'Hürtgen Forest', 'Omaha Beach', 'Saint-Vith', 'Utah Beach'
  ];
  
  const alliesCount = Math.floor(Math.random() * 50);
  const axisCount = Math.floor(Math.random() * 50);
  const totalMinutes = Math.floor(Math.random() * 90);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return {
    alliesCount,
    axisCount,
    gameTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    alliesScore: Math.floor(Math.random() * 5),
    axisScore: Math.floor(Math.random() * 5),
    currentMap: maps[Math.floor(Math.random() * maps.length)],
    nextMap: maps[Math.floor(Math.random() * maps.length)],
    maxPlayers: 100
  };
};

// Simulate API call with random success/failure
const fetchServerData = async (url: string): Promise<ServerData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 90% success rate for demo
      if (Math.random() < 0.9) {
        resolve(generateMockServerData());
      } else {
        reject(new Error('Server unreachable'));
      }
    }, Math.random() * 2000 + 500); // Random delay between 500-2500ms
  });
};

export const loadServerConfigurations = async (): Promise<ServerConfig[]> => {
  try {
    // Try different paths for development vs production
    const paths = ['/servers.json', './servers.json', '/oce-server-status/servers.json'];
    let response: Response | null = null;
    
    for (const path of paths) {
      try {
        response = await fetch(path);
        if (response.ok) {
          break;
        }
      } catch (error) {
        // Continue to next path
        continue;
      }
    }
    
    if (!response || !response.ok) {
      throw new Error('Failed to load server configurations from any path');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading server configurations:', error);
    // Return default servers if configuration file is not found
    return [
      {
        id: "anzr-1",
        name: "ANZR Server #1",
        url: "https://api.example.com/server1/status",
        description: "Primary ANZR Battle Server"
      },
      {
        id: "anzr-2", 
        name: "ANZR Server #2",
        url: "https://api.example.com/server2/status",
        description: "Secondary ANZR Battle Server"
      }
    ];
  }
};

export const pollServerStatus = async (serverConfig: ServerConfig): Promise<ServerStatus> => {
  try {
    const data = await Promise.race([
      fetchServerData(serverConfig.url),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), API_TIMEOUT)
      )
    ]);
    
    return {
      id: serverConfig.id,
      name: serverConfig.name,
      status: 'online',
      lastUpdate: new Date(),
      data
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      id: serverConfig.id,
      name: serverConfig.name,
      status: 'error',
      lastUpdate: new Date(),
      error: errorMessage
    };
  }
};

export const pollAllServers = async (serverConfigs: ServerConfig[]): Promise<ServerStatus[]> => {
  const promises = serverConfigs.map(config => pollServerStatus(config));
  return Promise.all(promises);
};