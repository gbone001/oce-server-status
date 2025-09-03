import { useState, useEffect, useCallback } from 'react';
import { ServerConfig, ServerStatus } from '../types';
import { ServerDataService } from '../services/ServerDataService';
import { defaultConfig } from '../config';

export const useServerData = () => {
  const [servers, setServers] = useState<ServerConfig[]>([]);
  const [serverStatuses, setServerStatuses] = useState<Map<string, ServerStatus>>(new Map());
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServerStatuses = useCallback(async (serverList: ServerConfig[]) => {
    if (serverList.length === 0) return;

    try {
      const statusPromises = serverList.map(server => 
        ServerDataService.fetchServerStatus(server)
      );
      
      const statuses = await Promise.allSettled(statusPromises);
      const statusMap = new Map<string, ServerStatus>();
      
      statuses.forEach((result, index) => {
        const server = serverList[index];
        if (result.status === 'fulfilled') {
          statusMap.set(server.id, result.value);
        } else {
          statusMap.set(server.id, {
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
            error: 'Failed to fetch data'
          });
        }
      });
      
      setServerStatuses(statusMap);
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (servers.length > 0) {
      await fetchServerStatuses(servers);
    }
  }, [servers, fetchServerStatuses]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const config = await ServerDataService.fetchServersConfig();
        setServers(config.servers);
        await fetchServerStatuses(config.servers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load configuration');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [fetchServerStatuses]);

  useEffect(() => {
    if (servers.length === 0) return;

    const interval = setInterval(() => {
      refreshData();
    }, defaultConfig.pollInterval);

    return () => clearInterval(interval);
  }, [servers, refreshData]);

  return {
    servers,
    serverStatuses,
    lastRefresh,
    loading,
    error,
    refreshData
  };
};