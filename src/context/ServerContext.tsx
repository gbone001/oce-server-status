import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ServerContextType, ServerStatus, ServerConfig } from '../types';
import { loadServerConfigurations, pollAllServers } from '../api/serverPoller';

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const useServerContext = () => {
  const context = useContext(ServerContext);
  if (context === undefined) {
    throw new Error('useServerContext must be used within a ServerProvider');
  }
  return context;
};

interface ServerProviderProps {
  children: React.ReactNode;
}

export const ServerProvider: React.FC<ServerProviderProps> = ({ children }) => {
  const [servers, setServers] = useState<ServerStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [serverConfigs, setServerConfigs] = useState<ServerConfig[]>([]);

  const refreshData = useCallback(async () => {
    if (serverConfigs.length === 0) return;
    
    setLoading(true);
    try {
      const serverStatuses = await pollAllServers(serverConfigs);
      setServers(serverStatuses);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error refreshing server data:', error);
    } finally {
      setLoading(false);
    }
  }, [serverConfigs]);

  // Initialize server configurations
  useEffect(() => {
    const loadConfigs = async () => {
      const configs = await loadServerConfigurations();
      setServerConfigs(configs);
      
      // Initialize servers with loading state
      const initialServers: ServerStatus[] = configs.map(config => ({
        id: config.id,
        name: config.name,
        status: 'loading' as const,
        lastUpdate: new Date()
      }));
      setServers(initialServers);
    };
    
    loadConfigs();
  }, []);

  // Initial data load and periodic refresh
  useEffect(() => {
    if (serverConfigs.length > 0) {
      refreshData();
      
      // Set up polling interval (1 minute)
      const interval = setInterval(refreshData, 60000);
      
      return () => clearInterval(interval);
    }
  }, [serverConfigs, refreshData]);

  const value: ServerContextType = {
    servers,
    loading,
    lastRefresh,
    refreshData
  };

  return (
    <ServerContext.Provider value={value}>
      {children}
    </ServerContext.Provider>
  );
};