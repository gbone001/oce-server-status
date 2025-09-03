import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { ServerStatus, ServerWithStatus } from '../types/server';
import { ServerPoller } from '../api/serverPoller';

interface ServerContextType {
  servers: ServerWithStatus[];
  loading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  refreshServers: () => Promise<void>;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const useServerContext = (): ServerContextType => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error('useServerContext must be used within a ServerProvider');
  }
  return context;
};

interface ServerProviderProps {
  children: ReactNode;
}

export const ServerProvider: React.FC<ServerProviderProps> = ({ children }) => {
  const [servers, setServers] = useState<ServerWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const poller = ServerPoller.getInstance();

  const refreshServers = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const [serverConfigs, statuses] = await Promise.all([
        poller.loadServers(),
        poller.pollAllServers()
      ]);

      const serversWithStatus: ServerWithStatus[] = serverConfigs.map(server => {
        const status = statuses.find(s => s.id === server.id);
        return {
          ...server,
          status
        };
      });

      setServers(serversWithStatus);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh servers');
      console.error('Error refreshing servers:', err);
    } finally {
      setLoading(false);
    }
  }, [poller]);

  useEffect(() => {
    // Initial load
    refreshServers();

    // Set up polling subscription
    const unsubscribe = poller.subscribe((statuses: ServerStatus[]) => {
      setServers(prevServers => 
        prevServers.map(server => {
          const status = statuses.find(s => s.id === server.id);
          return {
            ...server,
            status
          };
        })
      );
      setLastRefresh(new Date());
    });

    // Start polling every minute
    poller.startPolling(60000);

    return () => {
      unsubscribe();
      poller.stopPolling();
    };
  }, [poller, refreshServers]);

  const value: ServerContextType = {
    servers,
    loading,
    error,
    lastRefresh,
    refreshServers
  };

  return (
    <ServerContext.Provider value={value}>
      {children}
    </ServerContext.Provider>
  );
};