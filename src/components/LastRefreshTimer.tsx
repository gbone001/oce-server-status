import React from 'react';

interface LastRefreshTimerProps {
  lastRefresh: Date | null;
  refreshData: () => void;
}

export const LastRefreshTimer: React.FC<LastRefreshTimerProps> = ({ lastRefresh, refreshData }) => {
  const [timeAgo, setTimeAgo] = React.useState<string>('');

  React.useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastRefresh) {
        setTimeAgo('Never');
        return;
      }

      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastRefresh.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        setTimeAgo(`${diffInSeconds}s ago`);
      } else {
        const minutes = Math.floor(diffInSeconds / 60);
        setTimeAgo(`${minutes}m ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);

    return () => clearInterval(interval);
  }, [lastRefresh]);

  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Last updated: <span className="font-medium ml-1">{timeAgo}</span>
      </div>
      
      <button
        onClick={refreshData}
        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>
  );
};