import React from 'react';
import './ServerStatusIndicator.css';

interface ServerStatusIndicatorProps {
  online: boolean;
  ping?: number;
  className?: string;
}

export const ServerStatusIndicator: React.FC<ServerStatusIndicatorProps> = ({
  online,
  ping,
  className = ''
}) => {
  const getStatusInfo = () => {
    if (!online) {
      return {
        status: 'offline',
        label: 'Offline',
        color: '#ff4444'
      };
    }

    if (ping === undefined) {
      return {
        status: 'unknown',
        label: 'Unknown',
        color: '#888888'
      };
    }

    if (ping < 50) {
      return {
        status: 'excellent',
        label: 'Excellent',
        color: '#44ff44'
      };
    } else if (ping < 100) {
      return {
        status: 'good',
        label: 'Good',
        color: '#ffff44'
      };
    } else if (ping < 200) {
      return {
        status: 'fair',
        label: 'Fair',
        color: '#ff8844'
      };
    } else {
      return {
        status: 'poor',
        label: 'Poor',
        color: '#ff4444'
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`server-status-indicator ${statusInfo.status} ${className}`}>
      <div 
        className="status-dot"
        style={{ backgroundColor: statusInfo.color }}
        title={`${statusInfo.label}${ping !== undefined ? ` (${ping}ms)` : ''}`}
      />
      <span className="status-text">
        {statusInfo.label}
        {ping !== undefined && ` (${ping}ms)`}
      </span>
    </div>
  );
};