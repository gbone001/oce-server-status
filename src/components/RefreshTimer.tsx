import React, { useState, useEffect } from 'react';
import './RefreshTimer.css';

interface RefreshTimerProps {
  lastRefresh: Date | null;
  onRefresh: () => void;
  intervalMs?: number;
  className?: string;
}

export const RefreshTimer: React.FC<RefreshTimerProps> = ({
  lastRefresh,
  onRefresh,
  intervalMs = 60000, // 1 minute default
  className = ''
}) => {
  const [timeUntilNext, setTimeUntilNext] = useState<number>(intervalMs);
  const [timeSinceRefresh, setTimeSinceRefresh] = useState<string>('');

  useEffect(() => {
    const updateTimers = () => {
      if (!lastRefresh) {
        setTimeSinceRefresh('Never');
        setTimeUntilNext(intervalMs);
        return;
      }

      const now = Date.now();
      const lastRefreshTime = lastRefresh.getTime();
      const timeSince = now - lastRefreshTime;
      const timeUntil = Math.max(0, intervalMs - (timeSince % intervalMs));

      // Format time since last refresh
      if (timeSince < 60000) {
        setTimeSinceRefresh(`${Math.floor(timeSince / 1000)}s ago`);
      } else if (timeSince < 3600000) {
        setTimeSinceRefresh(`${Math.floor(timeSince / 60000)}m ago`);
      } else {
        setTimeSinceRefresh(`${Math.floor(timeSince / 3600000)}h ago`);
      }

      setTimeUntilNext(timeUntil);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);

    return () => clearInterval(interval);
  }, [lastRefresh, intervalMs]);

  const formatTimeUntilNext = (ms: number): string => {
    const seconds = Math.ceil(ms / 1000);
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getProgressPercentage = (): number => {
    if (!lastRefresh) return 0;
    const elapsed = Date.now() - lastRefresh.getTime();
    const progress = (elapsed % intervalMs) / intervalMs;
    return Math.min(progress * 100, 100);
  };

  return (
    <div className={`refresh-timer ${className}`}>
      <div className="refresh-info">
        <div className="last-refresh">
          <span className="label">Last update:</span>
          <span className="time">{timeSinceRefresh}</span>
        </div>
        <div className="next-refresh">
          <span className="label">Next in:</span>
          <span className="time">{formatTimeUntilNext(timeUntilNext)}</span>
        </div>
      </div>
      
      <div className="refresh-controls">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <button 
          className="refresh-button"
          onClick={onRefresh}
          title="Refresh now"
          aria-label="Refresh server status"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};