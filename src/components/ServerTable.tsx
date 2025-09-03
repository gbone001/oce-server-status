import React from 'react';
import { ServerStatus } from '../types';
import { ServerStatusIndicator } from './ServerStatusIndicator';
import './ServerTable.css';

interface ServerTableProps {
  servers: ServerStatus[];
  loading?: boolean;
}

export const ServerTable: React.FC<ServerTableProps> = ({ servers, loading = false }) => {
  if (servers.length === 0 && !loading) {
    return (
      <div className="server-table-empty">
        <p>No servers configured. Please add server configurations to public/servers.json</p>
      </div>
    );
  }

  const getTotalPlayers = (server: ServerStatus): string => {
    if (!server.data) return 'N/A';
    return `${server.data.alliesCount + server.data.axisCount}/${server.data.maxPlayers}`;
  };

  const getScoreDisplay = (server: ServerStatus): string => {
    if (!server.data) return 'N/A';
    return `${server.data.alliesScore} - ${server.data.axisScore}`;
  };

  return (
    <div className="server-table-container">
      <div className="table-wrapper">
        <table className="server-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Server Name</th>
              <th>Players</th>
              <th>Allies</th>
              <th>Axis</th>
              <th>Game Time</th>
              <th>Score (A-X)</th>
              <th>Current Map</th>
              <th>Next Map</th>
            </tr>
          </thead>
          <tbody>
            {servers.map((server) => (
              <tr key={server.id} className={`server-row status-${server.status}`}>
                <td className="status-cell">
                  <ServerStatusIndicator status={server.status} />
                </td>
                <td className="server-name">
                  <div className="server-name-content">
                    <span className="name">{server.name}</span>
                    <span className="last-update">
                      Updated: {server.lastUpdate.toLocaleTimeString()}
                    </span>
                  </div>
                </td>
                <td className="players-total">
                  {server.status === 'loading' ? (
                    <span className="loading-text">Loading...</span>
                  ) : server.status === 'error' ? (
                    <span className="error-text">Error</span>
                  ) : (
                    getTotalPlayers(server)
                  )}
                </td>
                <td className="allies-count">
                  {server.status === 'loading' ? '...' : 
                   server.status === 'error' ? 'N/A' : 
                   server.data?.alliesCount ?? 'N/A'}
                </td>
                <td className="axis-count">
                  {server.status === 'loading' ? '...' : 
                   server.status === 'error' ? 'N/A' : 
                   server.data?.axisCount ?? 'N/A'}
                </td>
                <td className="game-time">
                  {server.status === 'loading' ? '...' : 
                   server.status === 'error' ? 'N/A' : 
                   server.data?.gameTime ?? 'N/A'}
                </td>
                <td className="score">
                  {server.status === 'loading' ? '...' : 
                   server.status === 'error' ? 'N/A' : 
                   getScoreDisplay(server)}
                </td>
                <td className="current-map">
                  {server.status === 'loading' ? '...' : 
                   server.status === 'error' ? 'N/A' : 
                   server.data?.currentMap ?? 'N/A'}
                </td>
                <td className="next-map">
                  {server.status === 'loading' ? '...' : 
                   server.status === 'error' ? 'N/A' : 
                   server.data?.nextMap ?? 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {servers.some(server => server.status === 'error') && (
        <div className="error-summary">
          <h3>Error Details:</h3>
          {servers
            .filter(server => server.status === 'error')
            .map(server => (
              <div key={server.id} className="error-detail">
                <strong>{server.name}:</strong> {server.error || 'Unknown error'}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};