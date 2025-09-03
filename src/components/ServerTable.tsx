import React from 'react';
import { ServerWithStatus } from '../types/server';
import { ServerStatusIndicator } from './ServerStatusIndicator';
import './ServerTable.css';

interface ServerTableProps {
  servers: ServerWithStatus[];
  loading?: boolean;
  className?: string;
}

export const ServerTable: React.FC<ServerTableProps> = ({
  servers,
  loading = false,
  className = ''
}) => {
  if (loading && servers.length === 0) {
    return (
      <div className={`server-table-loading ${className}`}>
        <div className="loading-spinner" />
        <p>Loading server status...</p>
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <div className={`server-table-empty ${className}`}>
        <p>No servers configured</p>
      </div>
    );
  }

  const formatPlayerCount = (current: number, max: number) => {
    return `${current}/${max}`;
  };

  const formatScore = (score?: { team1: number; team2: number }) => {
    if (!score) return '-';
    return `${score.team1} - ${score.team2}`;
  };

  const getServerRowClass = (server: ServerWithStatus) => {
    const baseClass = 'server-row';
    if (!server.status) return `${baseClass} unknown`;
    if (!server.status.online) return `${baseClass} offline`;
    return `${baseClass} online`;
  };

  return (
    <div className={`server-table-container ${className}`}>
      <div className="server-table">
        <div className="table-header">
          <div className="header-cell server-name">Server</div>
          <div className="header-cell status">Status</div>
          <div className="header-cell players">Players</div>
          <div className="header-cell map">Map</div>
          <div className="header-cell score">Score</div>
          <div className="header-cell region">Region</div>
        </div>
        
        <div className="table-body">
          {servers.map((server) => (
            <div key={server.id} className={getServerRowClass(server)}>
              <div className="cell server-name">
                <div className="server-info">
                  <div className="name">{server.name}</div>
                  <div className="address">{server.ip}:{server.port}</div>
                </div>
              </div>
              
              <div className="cell status">
                <ServerStatusIndicator 
                  online={server.status?.online ?? false}
                  ping={server.status?.ping}
                />
              </div>
              
              <div className="cell players">
                {server.status ? (
                  <div className="player-count">
                    <span className="count">
                      {formatPlayerCount(server.status.playerCount, server.status.maxPlayers)}
                    </span>
                    <div className="player-bar">
                      <div 
                        className="player-fill"
                        style={{ 
                          width: `${(server.status.playerCount / server.status.maxPlayers) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <span className="no-data">-</span>
                )}
              </div>
              
              <div className="cell map">
                <span className="map-name">
                  {server.status?.map ?? 'Unknown'}
                </span>
              </div>
              
              <div className="cell score">
                <span className="score-text">
                  {formatScore(server.status?.score)}
                </span>
              </div>
              
              <div className="cell region">
                <span className="region-name">{server.region}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};