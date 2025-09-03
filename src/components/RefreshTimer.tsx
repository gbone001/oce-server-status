import React, { useState, useEffect } from 'react';
import './RefreshTimer.css';

interface RefreshTimerProps {
  lastRefresh: Date | null;
  onRefresh: () => void;
  refreshInterval?: number; // in milliseconds
  className?: string;
}

export const RefreshTimer: React.FC<RefreshTimerProps> = ({
  lastRefresh,
  onRefresh,
  refreshInterval = 60000, // 1 minute default
  className = ''
}) => {
  const [timeUntilNext, setTimeUntilNext] = useState<number>(0);
  const [timeSinceLast, setTimeSinceLast] = useState<string>('Never');

  useEffect(() => {
    const updateTimers = () => {
      const now = new Date();
      
      if (lastRefresh) {
        const elapsed = now.getTime() - lastRefresh.getTime();
        const remaining = Math.max(0, refreshInterval - elapsed);
        
        setTimeUntilNext(remaining);
        
        // Format time since last refresh
        const secondsElapsed = Math.floor(elapsed / 1000);
        if (secondsElapsed < 60) {
          setTimeSinceLast(`${secondsElapsed}s ago`);
        } else if (secondsElapsed < 3600) {
          const minutes = Math.floor(secondsElapsed / 60);
          const seconds = secondsElapsed % 60;
          setTimeSinceLast(`${minutes}m ${seconds}s ago`);
        } else {
          const hours = Math.floor(secondsElapsed / 3600);
          const minutes = Math.floor((secondsElapsed % 3600) / 60);
          setTimeSinceLast(`${hours}h ${minutes}m ago`);
        }
      } else {
        setTimeUntilNext(refreshInterval);
        setTimeSinceLast('Never');
      }
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);

    return () => clearInterval(interval);
  }, [lastRefresh, refreshInterval]);

  const formatTimeRemaining = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `0:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = lastRefresh 
    ? Math.max(0, 100 - (timeUntilNext / refreshInterval) * 100)
    : 0;

  return (
    <div className={`refresh-timer ${className}`}>
      <div className="timer-info">
        <div className="last-refresh">
          <span className="label">Last refresh:</span>
          <span className="value">{timeSinceLast}</span>
        </div>
        <div className="next-refresh">
          <span className="label">Next refresh:</span>
          <span className="value">{formatTimeRemaining(timeUntilNext)}</span>
        </div>
      </div>
      
      <div className="timer-controls">
        <button 
          className="refresh-button"
          onClick={onRefresh}
          title="Refresh now"
        >
          🔄 Refresh
        </button>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};