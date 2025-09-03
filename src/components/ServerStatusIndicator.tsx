import React from 'react';
import { ServerStatus } from '../types';
import './ServerStatusIndicator.css';

interface ServerStatusIndicatorProps {
  status: ServerStatus['status'];
  className?: string;
}

export const ServerStatusIndicator: React.FC<ServerStatusIndicatorProps> = ({ 
  status, 
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          color: '#00ff41', // Matrix green
          label: 'Online',
          icon: '●'
        };
      case 'offline':
        return {
          color: '#ff6b6b',
          label: 'Offline', 
          icon: '●'
        };
      case 'error':
        return {
          color: '#dc2626', // Red accent
          label: 'Error',
          icon: '⚠'
        };
      case 'loading':
        return {
          color: '#ffd700', // Gold accent
          label: 'Loading',
          icon: '⟳'
        };
      default:
        return {
          color: '#64748b',
          label: 'Unknown',
          icon: '?'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`server-status-indicator ${className}`}>
      <span 
        className={`status-icon status-${status}`}
        style={{ color: config.color }}
        title={config.label}
      >
        {config.icon}
      </span>
      <span className="status-label">{config.label}</span>
    </div>
  );
};